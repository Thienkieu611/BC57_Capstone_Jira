import React, { useEffect, useState } from "react";
import {
  Avatar,
  Tooltip,
  Modal,
  Select,
  Collapse,
  Space,
  Input,
  message,
  InputNumber,
  Slider,
} from "antd";
import "../assets/sass/projectDetail.scss";
import { NavLink, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addUserProjectApiAction,
  deleteTaskApiAction,
  getAllStatusApiAction,
  getAllUserApiAction,
  getProjectDetailApiAction,
  getTaskDetailApiAction,
  removeUserProjectApiAction,
} from "../redux/Reducers/HomeReducer";
import {
  PlusOutlined,
  BugFilled,
  SnippetsFilled,
  DeleteOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import useResponsive from "./../hook/useResponsive.js";

const ProjectDetail = () => {
  const windowSize = useResponsive();
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskType, setTaskType] = useState("bug");

  const handleCreate = () => {
    setIsCreatingTask(false);
    setTaskName("");
    setTaskType("bug");
  };

  const handleCancelCreateTask = () => {
    setIsCreatingTask(false);
    setTaskName("");
    setTaskType("bug"); // Reset task type to default
  };

  // set modal add member
  const [isModalOpen, setIsModalOpen] = useState({
    modalAddMember: false,
    modalViewTaskDetail: false,
  });
  const onSearch = (value, _e, info) => console.log(info?.source, value);
  const showModal = (modalName) => {
    setIsModalOpen({
      ...isModalOpen,
      [modalName]: true,
    });
  };
  const handleDelete = async (taskId) => {
    const action = deleteTaskApiAction(taskId);
    dispatch(action);
  };
  const handleCancel = (modalName) => {
    setIsModalOpen({
      ...isModalOpen,
      [modalName]: false,
    });
  };
  const { arrProjectDetail, arrUser, arrTaskDetail, arrStatus } = useSelector(
    (state) => state.homeReducer
  );
  console.log(arrTaskDetail);

  const { userLogin } = useSelector((state) => state.userReducer);

  const params = useParams();
  const dispatch = useDispatch();

  const getAllUserApi = async () => {
    const action = getAllUserApiAction();
    dispatch(action);
  };

  useEffect(() => {
    getAllUserApi();
  }, []);
  const getProjectDetailApi = async (projectId) => {
    const action = getProjectDetailApiAction(projectId);
    dispatch(action);
  };
  useEffect(() => {
    getProjectDetailApi(params.projectId);
  }, [params.projectId]);

  const getTaskDetailApi = async (taskId) => {
    const action = await getTaskDetailApiAction(taskId);
    dispatch(action);
    showModal("modalViewTaskDetail");
  };
  const getAllStatusApi = async () => {
    const action = getAllStatusApiAction();
    dispatch(action);
  };

  useEffect(() => {
    getAllStatusApi();
  }, []);

  const status = arrStatus.map((sta) => sta.statusName);

  const [selectedStatus, setSelectedStatus] = useState("");

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };

  const [selectedPriority, setSelectedPriority] = useState("high");

  const handlePriorityChange = (value) => {
    setSelectedPriority(value);
  };

  const [estimate, setEstimate] = useState(arrTaskDetail.originalEstimate);

  const handleEstimateChange = (e) => {
    setEstimate(e.target.value);
  };

  const filterTasksByStatus = (statusId) => {
    return arrProjectDetail.lstTask?.filter(
      (task) => task.statusId === statusId
    );
  };
  const checkTaskType = (taskType) => {
    if (taskType === "bug") {
      return <BugFilled className="text-danger me-2" />;
    } else if (taskType === "new task") {
      return <SnippetsFilled className="text-primary-emphasis me-2" />;
    }
  };
  const checkPriority = (priority) => {
    switch (priority) {
      case "Lowest":
        return "rounded px-1 pb-0.5 text-dark-subtle border border-dark-subtle";
      case "Low":
        return "rounded px-1 pb-0.5 text-primary border border-primary";
      case "Medium":
        return "rounded px-1 pb-0.5 text-success border border-success-subtle";
      case "High":
        return "rounded px-1 pb-0.5 text-danger border border-danger";
      default:
        return null;
    }
  };
  const checkStatus = (statusId) => {
    switch (statusId) {
      case "1":
        return "BACKLOG";
      case "2":
        return "SELECTED FOR DEVELOPMENT";
      case "3":
        return "IN PROGRESS";
      case "4":
        return "DONE";
    }
  };
  const checkSelectPriority = (priorityId) => {
    switch (priorityId) {
      case 1:
        return "High";
      case 2:
        return "Medium";
      case 3:
        return "Low";
      case 4:
        return "Lowest";
    }
  };
  const hello = checkSelectPriority(arrTaskDetail.priorityId);
  console.log(hello);

  //add member
  const [remainingUsers, setRemainingUsers] = useState([]);

  const handleAddMember = (user) => {
    if (user) {
      dispatch(addUserProjectApiAction(arrProjectDetail.id, user));
    } else {
      message.error("Please select a user to add.");
    }
  };

  const handleRemoveMember = (user) => {
    dispatch(removeUserProjectApiAction(arrProjectDetail.id, user.userId));
  };
  useEffect(() => {
    const usersNotAdded = arrUser.filter((user) => {
      return !arrProjectDetail.members.find(
        (member) => member.userId === user.userId
      );
    });
    setRemainingUsers(usersNotAdded);
  }, [arrUser, arrProjectDetail.members]);

  //search
  const [searchValue, setSearchValue] = useState("");
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };
  useEffect(() => {
    const filteredUsers = arrUser.filter((user) =>
      user.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setRemainingUsers(filteredUsers);
  }, [searchValue, arrUser]);

  const [estimatedHours, setEstimatedHours] = useState(
    arrTaskDetail.timeTrackingRemaining
  );
  const [hoursSpent, setHoursSpent] = useState(arrTaskDetail.timeTrackingSpent);
  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    setEstimatedHours(arrTaskDetail.timeTrackingRemaining);
    setHoursSpent(arrTaskDetail.timeTrackingSpent);
    setSliderValue(arrTaskDetail.timeTrackingSpent);
  }, [arrTaskDetail]);
  const timeEst = (value) => {
    setEstimatedHours(value);
    updateSliderValue();
  };

  const timeSpent = (value) => {
    setHoursSpent(value);
    updateSliderValue();
  };

  // const remainHours = estimatedHours - hoursSpent;
  const disabled = estimatedHours === 0;
  const updateSliderValue = () => {
    const newValue = hoursSpent + estimatedHours;

    setSliderValue(newValue);
  };

  return (
    <div className="project-detail container mt-4">
      <p>
        <NavLink
          className={"text-decoration-none text-secondary me-2 next-detail"}
          to={"index"}
        >
          Projects
        </NavLink>
        <span>/ {arrProjectDetail.projectName}</span>
      </p>
      <div
        className={`${
          windowSize.widthWindow < 315
            ? "project-header"
            : "project-header d-flex"
        }`}
      >
        <h3 className="w-25">Board</h3>
        <div
          className={`${
            windowSize.widthWindow < 315
              ? "d-flex align-items-center"
              : "member d-flex align-items-center"
          }`}
        >
          <p className="m-0">Members</p>
          <div>
            {arrProjectDetail.members &&
              arrProjectDetail.members.map((detail, index) => {
                return (
                  <Tooltip title={detail.name} placement="top" key={index}>
                    <Avatar src={detail.avatar} alt={detail.name} />
                  </Tooltip>
                );
              })}
            <Tooltip title="Add member" placement="top">
              <Avatar
                onClick={() => showModal("modalAddMember")}
                style={{
                  backgroundColor: "#fde3cf",
                  color: "#f56a00",
                  cursor: "pointer",
                }}
                icon={<PlusOutlined />}
              />
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="project-content d-flex justify-content-around px-5 row">
        <div className="col mb-4 col-lg-3 col-md-12 col-sm-12 col-12 project-item">
          <p>
            <span className="title-detail item1">BACKLOG</span>
          </p>
          <div className="detail-info">
            {filterTasksByStatus("1")?.map((task) => (
              <div
                className="task-detail"
                key={task.alias}
                style={{ cursor: "pointer" }}
              >
                {task.lstTaskDeTail?.map((detail, index) => (
                  <div
                    onClick={() => getTaskDetailApi(detail.taskId)}
                    className="task-detail-item bg-white"
                    key={index}
                  >
                    <p className="m-0">{detail.taskName}</p>
                    <div className="task-bottom">
                      <div className="task-left">
                        {checkTaskType(detail.taskTypeDetail.taskType)}
                        <span
                          className={checkPriority(
                            detail.priorityTask.priority
                          )}
                        >
                          {detail.priorityTask.priority}
                        </span>
                      </div>
                      <div className="task-right">
                        <Avatar.Group
                          size={25}
                          maxCount={2}
                          maxStyle={{
                            color: "#f56a00",
                            backgroundColor: "#fde3cf",
                          }}
                        >
                          {detail.assigness?.map((member) => (
                            <Tooltip title={member.name} placement="top">
                              <Avatar src={member.avatar} alt={member.name} />
                            </Tooltip>
                          ))}
                        </Avatar.Group>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div>
              <NavLink
                to={"/projects/createTask"}
                className="w-100 text-decoration-none text-blackrounded border p-2 d-block btn btn-light"
                style={{
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <PlusOutlined /> Create
              </NavLink>
            </div>
          </div>
        </div>
        <div className="col mb-4 col-lg-3 col-md-12 col-sm-12 col-12 project-item">
          <p>
            <span className="title-detail item2">SELECTED FOR DEVELOPMENT</span>
          </p>
          <div className="detail-info">
            {filterTasksByStatus("2")?.map((task) => (
              <div
                className="task-detail "
                key={task.alias}
                style={{ cursor: "pointer" }}
              >
                {task.lstTaskDeTail?.map((detail, index) => (
                  <div
                    onClick={() => getTaskDetailApi(detail.taskId)}
                    className="task-detail-item bg-white"
                    key={index}
                  >
                    <p className="m-0">{detail.taskName}</p>
                    <div className="task-bottom">
                      <div className="task-left">
                        {checkTaskType(detail.taskTypeDetail.taskType)}
                        <span
                          className={checkPriority(
                            detail.priorityTask.priority
                          )}
                        >
                          {detail.priorityTask.priority}
                        </span>
                      </div>
                      <div className="task-right">
                        <Avatar.Group
                          size={25}
                          maxCount={2}
                          maxStyle={{
                            color: "#f56a00",
                            backgroundColor: "#fde3cf",
                          }}
                        >
                          {detail.assigness?.map((member) => (
                            <Tooltip title={member.name} placement="top">
                              <Avatar src={member.avatar} alt={member.name} />
                            </Tooltip>
                          ))}
                        </Avatar.Group>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="col mb-4 col-lg-3 col-md-12 col-sm-12 col-12 project-item">
          <p>
            <span className="title-detail item3">IN PROGRESS</span>
          </p>
          <div className="detail-info">
            {filterTasksByStatus("3")?.map((task) => (
              <div
                className="task-detail "
                key={task.alias}
                style={{ cursor: "pointer" }}
              >
                {task.lstTaskDeTail?.map((detail, index) => (
                  <div
                    onClick={() => getTaskDetailApi(detail.taskId)}
                    className="task-detail-item bg-white"
                    key={index}
                  >
                    <p className="m-0">{detail.taskName}</p>
                    <div className="task-bottom">
                      <div className="task-left">
                        {checkTaskType(detail.taskTypeDetail.taskType)}
                        <span
                          className={checkPriority(
                            detail.priorityTask.priority
                          )}
                        >
                          {detail.priorityTask.priority}
                        </span>
                      </div>
                      <div className="task-right">
                        <Avatar.Group
                          size={25}
                          maxCount={2}
                          maxStyle={{
                            color: "#f56a00",
                            backgroundColor: "#fde3cf",
                          }}
                        >
                          {detail.assigness?.map((member) => (
                            <Tooltip title={member.name} placement="top">
                              <Avatar src={member.avatar} alt={member.name} />
                            </Tooltip>
                          ))}
                        </Avatar.Group>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="col mb-4 col-lg-3 col-md-12 col-sm-12 col-12 project-item">
          <p>
            <span className="title-detail item4">DONE</span>
          </p>
          <div className="detail-info">
            {filterTasksByStatus("4")?.map((task) => (
              <div
                className="task-detail "
                key={task.alias}
                style={{ cursor: "pointer" }}
              >
                {task.lstTaskDeTail?.map((detail, index) => (
                  <div
                    onClick={() => getTaskDetailApi(detail.taskId)}
                    className="task-detail-item bg-white"
                    key={index}
                  >
                    <p className="m-0">{detail.taskName}</p>
                    <div className="task-bottom">
                      <div className="task-left">
                        {checkTaskType(detail.taskTypeDetail.taskType)}
                        <span
                          className={checkPriority(
                            detail.priorityTask.priority
                          )}
                        >
                          {detail.priorityTask.priority}
                        </span>
                      </div>
                      <div className="task-right">
                        <Avatar.Group
                          size={25}
                          maxCount={2}
                          maxStyle={{
                            color: "#f56a00",
                            backgroundColor: "#fde3cf",
                          }}
                        >
                          {detail.assigness?.map((member) => (
                            <Tooltip title={member.name} placement="top">
                              <Avatar src={member.avatar} alt={member.name} />
                            </Tooltip>
                          ))}
                        </Avatar.Group>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="modal-add-member w-100 ">
        <Modal
          className="modal-content p-4"
          open={isModalOpen.modalAddMember}
          onCancel={() => handleCancel("modalAddMember")}
          width={1000}
          height={1000}
          maskClosable={false}
          style={{ top: "50", maxWidth: "100%", maxHeight: "90%" }}
          footer=""
        >
          <div className="px-3 modal-header">
            <h5
              className="pt-3"
              style={{ fontSize: windowSize.widthWindow < 585 ? "18px" : "" }}
            >
              Add members to project
              <span className="text-primary">
                {" "}
                {arrProjectDetail.projectName}
              </span>
            </h5>
            <hr />
          </div>
          <div
            className={`${windowSize.widthWindow < 768 ? "pt-0" : "p-3 pt-0"}`}
          >
            <div className="d-flex justify-content-start align-items-baseline p-3 pb-0">
              <p className="d-inline-block me-5 fw-medium">Search users</p>
              <Search
                placeholder="search members"
                allowClear
                onSearch={onSearch}
                onChange={handleSearchChange}
                className="d-inline-block ms-5"
                style={{
                  width: 200,
                }}
              />
            </div>
            <div
              className={` ${
                windowSize.widthWindow < 768
                  ? "h-100"
                  : "justify-content-between p-3 d-flex"
              }  `}
            >
              <div
                className={` ${
                  windowSize.widthWindow < 768 ? "" : "w-50 me-3"
                }`}
                style={{
                  overflow: "auto",
                  height: windowSize.widthWindow < 315 ? "170px" : "390px",
                }}
              >
                <h6 className="mb-3">Not yet added</h6>
                <div>
                  {remainingUsers.map((user) => (
                    <div className="d-flex justify-content-between mb-2 py-2 border-bottom">
                      <div className="d-flex justify-content-start">
                        <div>
                          <img
                            className={`${
                              windowSize.widthWindow < 315
                                ? "w-50 rounded-circle"
                                : "w-75 rounded-circle"
                            }`}
                            src={user.avatar}
                          />
                        </div>
                        <div className="text-truncate">
                          <p className="mb-0 ">{user.name}</p>
                          <p
                            className="mb-0 text-secondary"
                            style={{ fontSize: "12px" }}
                          >
                            User ID: {user.userId}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddMember(user)}
                        className="btn px-3 bg-primary me-2 ms-2 text-white"
                        style={{
                          height: "35px",
                          fontSize: windowSize.widthWindow < 920 ? "13px" : "",
                        }}
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div
                style={{
                  width: windowSize.widthWindow < 710 ? "100%" : "45%",
                }}
              >
                <h6 className="mb-3">Already in project</h6>
                <div
                  style={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    fontSize: windowSize.widthWindow < 920 ? "13px" : "",
                  }}
                >
                  {arrProjectDetail.members.map((userExist) => (
                    <div className="d-flex justify-content-between mb-2 py-2 border-bottom">
                      <div className="d-flex justify-content-start">
                        <div>
                          <img
                            className={`${
                              windowSize.widthWindow < 315
                                ? "w-50 rounded-circle"
                                : "w-75 rounded-circle"
                            }`}
                            src={userExist.avatar}
                          />
                        </div>
                        <div>
                          <p className="mb-0">{userExist.name}</p>
                          <p
                            className="mb-0 text-secondary"
                            style={{ fontSize: "12px" }}
                          >
                            User ID: {userExist.userId}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveMember(userExist)}
                        className="btn py-1 px-2 bg-danger text-white ms-2 ms-2"
                        style={{
                          height: "35px",
                          fontSize: windowSize.widthWindow < 920 ? "13px" : "",
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
      <div className="modal-view-task-detail w-100">
        <Modal
          className="modal-view-content p-4"
          open={isModalOpen.modalViewTaskDetail}
          onCancel={() => handleCancel("modalViewTaskDetail")}
          width={1000}
          maskClosable={false}
          style={{ top: "50" }}
          footer=""
        >
          <div className="">
            <div className="d-flex justify-content-between align-items-start">
              <h6>
                {/* {checkTaskType(arrTaskDetail?.taskTypeDetail?.taskType)}
                {arrTaskDetail?.taskTypeDetail?.taskType
                  .charAt(0)
                  .toUpperCase() +
                  arrTaskDetail?.taskTypeDetail.taskType.slice(1)} */}
              </h6>
              <DeleteOutlined
                onClick={() => handleDelete(arrTaskDetail.taskId)}
                className="text-danger me-4 fs-5"
              />
            </div>
            <div
              className={`${
                windowSize.widthWindow < 768
                  ? ""
                  : "view-task-info d-flex justify-content-between p-3"
              }`}
            >
              <div
                className="task-info-left"
                style={{ width: windowSize.widthWindow < 768 ? "" : "55%" }}
              >
                <h4>{arrTaskDetail.taskName}</h4>
                <div>
                  <p>Description</p>
                  <div>
                    <p className="rounded border p-2">
                      {arrTaskDetail.description}
                    </p>
                  </div>
                </div>
                <div>
                  <p>Comments</p>
                  <div className="d-flex align-items-baseline">
                    <p className="m-0">
                      <img
                        className="rounded-circle w-50"
                        src={userLogin.avatar}
                        alt="..."
                      />
                    </p>
                    <p className="rounded border w-100 p-2">Add comment</p>
                  </div>
                  <div style={{ maxHeight: "170px", overflowY: "auto" }}>
                    {arrTaskDetail?.lstComment?.map((comment) => (
                      <div>
                        <div className="d-flex align-items-baseline">
                          <p className="m-0">
                            <img
                              className="rounded-circle w-50"
                              src={comment.avatar}
                              alt="..."
                            />
                          </p>
                          <div className="">
                            <p className="m-0">{comment.name}</p>
                            <p className="m-0 fw-light">
                              {comment.commentContent}
                            </p>
                            <div className="text-secondary mt-3">
                              <span className="me-3">Edit</span>
                              <span>Delete</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div
                className="task-info-right"
                style={{ width: windowSize.widthWindow < 768 ? "" : "40%" }}
              >
                <Select
                  defaultValue={checkStatus(arrTaskDetail.statusId)}
                  value={checkStatus(arrTaskDetail.statusId)}
                  className="mb-3"
                  style={{
                    width: windowSize.widthWindow < 768 ? "100%" : 250,
                  }}
                  onChange={handleStatusChange}
                  options={arrStatus.map((sta) => ({
                    value: sta.statusName,
                    label: sta.statusName,
                  }))}
                />

                <div>
                  <Collapse
                    items={[
                      {
                        key: "1",
                        label: "Detail",
                        children: (
                          <div className="">
                            <div
                              className={`${
                                windowSize.widthWindow < 768 ? "" : "d-flex"
                              }`}
                            >
                              <p className="me-2">Assigness</p>

                              <div>
                                {arrTaskDetail?.assigness?.map((ass) => (
                                  <div className="d-flex align-items-center mb-2 border p-2 rounded ">
                                    <p className="m-0">
                                      <img
                                        className="rounded-circle w-50"
                                        src={ass.avatar}
                                        alt="..."
                                      />
                                    </p>
                                    <p
                                      className={`${
                                        windowSize.widthWindow < 1032
                                          ? "fs-7 mb-0"
                                          : "mb-0 me-2"
                                      }`}
                                    >
                                      {ass.name}
                                    </p>
                                    <CloseOutlined />
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="d-flex">
                              <p className="me-4">Priority</p>
                              <div>
                                <Select
                                  defaultValue={checkSelectPriority(
                                    arrTaskDetail.priorityId
                                  )}
                                  value={checkSelectPriority(
                                    arrTaskDetail.priorityId
                                  )}
                                  className="mb-3"
                                  style={{
                                    width: 110,
                                  }}
                                  onChange={handlePriorityChange}
                                  options={[
                                    {
                                      value: "high",
                                      label: "High",
                                    },
                                    {
                                      value: "low",
                                      label: "Low",
                                    },
                                    {
                                      value: "lowest",
                                      label: "Lowest",
                                    },
                                    {
                                      value: "medium",
                                      label: "Medium",
                                    },
                                  ]}
                                />
                              </div>
                            </div>
                            <div className="d-flex">
                              <p className="me-3">Estimate</p>
                              <div>
                                <Space.Compact>
                                  <Input
                                    value={`${arrTaskDetail.originalEstimate}m`}
                                    onChange={handleEstimateChange}
                                  ></Input>
                                </Space.Compact>
                              </div>
                            </div>

                            <div className="row my-2">
                              <label className="mb-2 fw-bold">
                                Time Tracking
                              </label>
                              <div className="d-flex">
                                <div className="col">
                                  <InputNumber
                                    id="hoursSpent"
                                    className="d-block w-100 fs-6"
                                    min={0}
                                    value={hoursSpent}
                                    onChange={timeSpent}
                                  />
                                  <label className="mb-2">Time spent</label>
                                </div>
                                <div></div>
                                <div className="col ms-2">
                                  <InputNumber
                                    className="d-block w-100 fs-6"
                                    id="estimatedHours"
                                    min={0}
                                    value={estimatedHours}
                                    onChange={timeEst}
                                  />
                                  <label className="mb-2">Time remaining</label>
                                </div>
                              </div>
                              <div className="px-2 mt-2">
                                <Slider
                                  max={"5"}
                                  value={sliderValue}
                                  disabled={disabled}
                                />
                                <div className="d-flex justify-content-between">
                                  <p>{hoursSpent}m logged</p>
                                  <p>
                                    {estimatedHours - hoursSpent}m remaining
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ),
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ProjectDetail;
