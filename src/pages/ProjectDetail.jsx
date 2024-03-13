import React, { useEffect, useState } from "react";
import {
  Avatar,
  Tooltip,
  Button,
  Modal,
  Select,
  Divider,
  Collapse,
  Space,
  Input,
  message,
} from "antd";
import "../assets/sass/projectDetail.scss";
import { NavLink, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addUserProjectApiAction,
  getAllUserApiAction,
  getProjectDetailApiAction,
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
import TextArea from "antd/es/input/TextArea";
const provinceData = ["Zhejiang", "Jiangsu"];
const cityData = {
  Zhejiang: ["Hangzhou", "Ningbo", "Wenzhou"],
  Jiangsu: ["Nanjing", "Suzhou", "Zhenjiang"],
};

const ProjectDetail = () => {
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskType, setTaskType] = useState("bug");

  const handleCreateTask = () => {
    setIsCreatingTask(true);
  };

  const handleCreate = () => {
    setIsCreatingTask(false);
    setTaskName("");
    setTaskType("bug"); // Reset task type to default
  };

  const handleCancelCreateTask = () => {
    setIsCreatingTask(false);
    setTaskName("");
    setTaskType("bug"); // Reset task type to default
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCreate();
    } else if (e.key === "Escape") {
      handleCancelCreateTask();
    }
  };
  const [cities, setCities] = useState(cityData[provinceData[0]]);
  const [secondCity, setSecondCity] = useState(cityData[provinceData[0]][0]);
  const handleProvinceChange = (value) => {
    setCities(cityData[value]);
    setSecondCity(cityData[value][0]);
  };
  const onSecondCityChange = (value) => {
    setSecondCity(value);
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
  const handleDelete = () => {
    //Cài đặt api xoá task
  };
  const handleCancel = (modalName) => {
    setIsModalOpen({
      ...isModalOpen,
      [modalName]: false,
    });
  };
  const { arrProjectDetail, arrUser } = useSelector(
    (state) => state.homeReducer
  );
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
      <div className="project-header d-flex">
        <h3 className="w-25">Board</h3>
        <div className="member d-flex align-items-center">
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

      <div className="project-content d-flex justify-content-around px-4">
        <div className="col-3 project-item">
          <p>
            <span className="title-detail item1">BACKLOG</span>
          </p>
          <div className="detail-info">
            {filterTasksByStatus("1")?.map((task) => (
              <div
                onClick={() => showModal("modalViewTaskDetail")}
                className="task-detail"
                key={task.alias}
                style={{ cursor: "pointer" }}
              >
                {task.lstTaskDeTail?.map((detail, index) => (
                  <div className="task-detail-item bg-white" key={index}>
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

                      {/* <CheckSquareFilled className="text-primary" /> */}
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div>
              {isCreatingTask ? (
                <div
                  className="rounded border bg-white focus-none"
                  onKeyDown={handleKeyDown}
                >
                  <TextArea
                    onBlur={handleCancelCreateTask}
                    className="task-textarea border border-0"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder="Enter task name"
                    autoSize={{
                      minRows: 3,
                      maxRows: 5,
                    }}
                  />
                  <Select
                    className="task-type-select"
                    defaultValue="bug"
                    onChange={(value) => setTaskType(value)}
                  >
                    <Option value="bug">
                      <BugFilled className="text-danger" />
                    </Option>
                    <Option value="new_task">
                      <SnippetsFilled className="text-primary" />
                    </Option>
                    {/* Add more options as needed */}
                  </Select>
                </div>
              ) : (
                <Button
                  className="w-100"
                  onClick={handleCreateTask}
                  type="primary"
                  icon={<PlusOutlined />}
                >
                  Create
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="col-3 project-item">
          <p>
            <span className="title-detail item2">SELECTED FOR DEVELOPMENT</span>
          </p>
          <div className="detail-info">
            {filterTasksByStatus("2")?.map((task) => (
              <div
                onClick={() => showModal("modalViewTaskDetail")}
                className="task-detail "
                key={task.alias}
                style={{ cursor: "pointer" }}
              >
                {task.lstTaskDeTail?.map((detail, index) => (
                  <div className="task-detail-item bg-white" key={index}>
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
        <div className="col-3 project-item">
          <p>
            <span className="title-detail item3">IN PROGRESS</span>
          </p>
          <div className="detail-info">
            {filterTasksByStatus("3")?.map((task) => (
              <div
                onClick={() => showModal("modalViewTaskDetail")}
                className="task-detail "
                key={task.alias}
                style={{ cursor: "pointer" }}
              >
                {task.lstTaskDeTail?.map((detail, index) => (
                  <div className="task-detail-item bg-white" key={index}>
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
        <div className="col-3 project-item">
          <p>
            <span className="title-detail item4">DONE</span>
          </p>
          <div className="detail-info">
            {filterTasksByStatus("4")?.map((task) => (
              <div
                onClick={() => showModal("modalViewTaskDetail")}
                className="task-detail "
                key={task.alias}
                style={{ cursor: "pointer" }}
              >
                {task.lstTaskDeTail?.map((detail, index) => (
                  <div className="task-detail-item bg-white" key={index}>
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
          maskClosable={false}
          style={{ top: "50" }}
          footer=""
        >
          <div className="px-3 modal-header">
            <h5 className="pt-3">
              Add members to project
              <span className="text-primary">
                {" "}
                {arrProjectDetail.projectName}
              </span>
            </h5>
            <hr />
          </div>
          <div className="p-3 pt-0">
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
            <div className="d-flex justify-content-between p-3">
              <div style={{ width: "50%" }}>
                <h6 className="mb-3">Not yet added</h6>
                <div style={{ maxHeight: "320px", overflowY: "auto" }}>
                  {remainingUsers.map((user) => (
                    <div className="d-flex justify-content-between mb-2 py-2 border-bottom">
                      <div className="d-flex justify-content-start">
                        <div>
                          <img
                            className="rounded-circle w-50"
                            src={user.avatar}
                          />
                        </div>
                        <div>
                          <p className="mb-0">{user.name}</p>
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
                        className="btn px-3 bg-primary me-3 text-white"
                        style={{ height: "35px" }}
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ width: "45%" }}>
                <h6 className="mb-3">Already in project</h6>
                <div
                  style={{
                    maxHeight: "300px",
                    overflowY: "auto",
                  }}
                >
                  {arrProjectDetail.members.map((userExist) => (
                    <div className="d-flex justify-content-between mb-2 py-2 border-bottom">
                      <div className="d-flex justify-content-start">
                        <div>
                          <img
                            className="rounded-circle w-50"
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
                        className="btn py-1 px-2 bg-danger text-white me-2 "
                        style={{ height: "35px" }}
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
                <BugFilled className="text-danger me-2" />
                Bug
              </h6>
              <DeleteOutlined className="text-danger me-4 fs-5" />
              {/* <CloseOutlined
                onClick={() => handleCancel("modalViewTaskDetail")}
              /> */}
            </div>
            <div className="view-task-info d-flex justify-content-between p-3">
              <div className="task-info-left" style={{ width: "55%" }}>
                <h3>Fix bug 2</h3>
                <div>
                  <p>Description</p>
                  <div>
                    <p className="rounded border p-2">Add description</p>
                  </div>
                </div>
                <div>
                  <p>Comments</p>
                  <div className="d-flex align-items-baseline">
                    <p className="m-0">
                      <img
                        className="rounded-circle w-50"
                        src="https://ui-avatars.com/api/?name=Bình Nguyễn"
                        alt=""
                      />
                    </p>
                    <p className="rounded border w-100 p-2">Add comment</p>
                  </div>
                </div>
              </div>
              <div className="task-info-right" style={{ width: "40%" }}>
                <Select
                  className="mb-3"
                  style={{
                    width: 120,
                  }}
                  value={secondCity}
                  onChange={onSecondCityChange}
                  options={cities.map((city) => ({
                    label: city,
                    value: city,
                  }))}
                />
                <div>
                  <Collapse
                    items={[
                      {
                        key: "1",
                        label: "Detail",
                        children: (
                          <div>
                            <div className="d-flex">
                              <p className="me-5">Assigness</p>
                              <div>
                                <div className="d-flex align-items-center mb-2 border p-2 rounded">
                                  <p className="m-0">
                                    <img
                                      className="rounded-circle w-50"
                                      src="https://ui-avatars.com/api/?name=Bình Nguyễn"
                                      alt=""
                                    />
                                  </p>
                                  <p className="m-0">Binh Nguyen</p>
                                  <CloseOutlined />
                                </div>
                                <div className="d-flex align-items-center mb-2 border p-2 rounded">
                                  <p className="m-0">
                                    <img
                                      className="rounded-circle w-50"
                                      src="https://ui-avatars.com/api/?name=Thienkieu"
                                      alt=""
                                    />
                                  </p>
                                  <p className="m-0">Thien Kieu</p>
                                  <CloseOutlined />
                                </div>
                              </div>
                            </div>
                            <div className="d-flex">
                              <p className="me-5">Priority</p>
                              <div className="">
                                <Select
                                  style={{
                                    width: 120,
                                  }}
                                  value={secondCity}
                                  onChange={onSecondCityChange}
                                  options={cities.map((city) => ({
                                    label: city,
                                    value: city,
                                  }))}
                                />
                              </div>
                            </div>
                            <div className="d-flex">
                              <p className="me-5">Estimate</p>
                              <div>
                                <Space.Compact>
                                  <Input defaultValue="6m"></Input>
                                </Space.Compact>
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
