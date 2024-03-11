import React, { useEffect, useState } from "react";
import { Avatar, Tag, Tooltip, Button, Modal, Card } from "antd";
import "../assets/sass/projectDetail.scss";
import { NavLink, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProjectDetailApiAction } from "../redux/Reducers/HomeReducer";
import { PlusOutlined, BugFilled, SnippetsFilled } from "@ant-design/icons";
import Search from "antd/es/input/Search";

const ProjectDetail = () => {
  // set modal add member
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onSearch = (value, _e, info) => console.log(info?.source, value);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const { arrProjectDetail } = useSelector((state) => state.homeReducer);
  console.log(arrProjectDetail);
  const params = useParams();

  const dispatch = useDispatch();
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
                onClick={() => showModal()}
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
              <div className="task-detail" key={task.alias}>
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

            <button className="btn btn-success w-100 text-left">
              <PlusOutlined /> <span>Create</span>
            </button>
          </div>
        </div>
        <div className="col-3 project-item">
          <p>
            <span className="title-detail item2">SELECTED FOR DEVELOPMENT</span>
          </p>
          <div className="detail-info">
            {filterTasksByStatus("2")?.map((task) => (
              <div className="task-detail " key={task.alias}>
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
              <div className="task-detail " key={task.alias}>
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
              <div className="task-detail " key={task.alias}>
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
      <div className="modal-add-member w-100">
        <Modal
          className="modal-content"
          title={`Add members to project ${arrProjectDetail.projectName}`}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <h4>{`Add members to project ${arrProjectDetail.projectName}`}</h4>
          <div className="search-member d-flex align-items-baseline">
            <p className="me-5">Search users</p>
            <Search
              className="search-input"
              placeholder="search members"
              allowClear
              onSearch={onSearch}
              style={{
                width: 1000,
              }}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ProjectDetail;
