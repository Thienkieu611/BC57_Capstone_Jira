import React, { useEffect, useState } from "react";
import { Avatar, Space, Table, Tag, Tooltip, Button, Modal } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProjectApiAction,
  getAllProjectApiAction,
} from "../redux/Reducers/HomeReducer";
import { NavLink } from "react-router-dom";

//set search
const onSearch = (value, _e, info) => console.log(info?.source, value);
const Home = () => {
  const { arrData } = useSelector((state) => state.homeReducer);

  const dispatch = useDispatch();

  const getAllProjectApi = async () => {
    const action = getAllProjectApiAction();
    dispatch(action);
  };

  const deleteProjectApi = async (projectId) => {
    const action = deleteProjectApiAction(projectId);
    await dispatch(action);
    getAllProjectApi();
  };

  useEffect(() => {
    getAllProjectApi();
  }, []);

  const [selectedProject, setSelectedProject] = useState(null);

  const handleDelete = (project) => {
    setSelectedProject(project);
    Modal.confirm({
      title: `Are you sure to delete ${project.projectName}?`,
      icon: <ExclamationCircleFilled />,

      okText: "Delete",
      okType: "danger",
      cancelText: "Cancle",
      async onOk() {
        await deleteProjectApi(project.id);
      },
      onCancel() {
        setSelectedProject(null);
      },
    });
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      width: "10%",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Project name",
      dataIndex: "projectName",
      key: "projectName",
      width: "25%",
      sorter: (a, b) => a.projectName.localeCompare(b.projectName),
      sortDirections: ["ascend", "descend"],
      render: (text, record, index) => (
        <NavLink
          to={`/projects/projectDetail/${record.id}`}
          className="text-primary text-decoration-none"
        >
          {text}
        </NavLink>
      ),
    },
    {
      title: "Category name",
      dataIndex: "categoryName",
      key: "categoryName",
      sorter: (a, b) => a.categoryName.localeCompare(b.categoryName),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Creator",
      dataIndex: "creatorName",
      key: "creatorName",
      sorter: (a, b) => a.creator.name.localeCompare(b.creator.name),
      sortDirections: ["ascend", "descend"],
      render: (text, record, index) => (
        <Tag color="geekblue" className="py-1 px-2">
          {record.creator.name}
        </Tag>
      ),
    },
    {
      title: "Members",
      dataIndex: "membersAvatar",
      key: "membersAvatar",
      render: (text, record, index) => (
        <Avatar.Group
          maxCount={2}
          maxStyle={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
        >
          {record.members.map((member, index) => (
            <Tooltip title={member.name} key={index} placement="top">
              <Avatar src={member.avatar} alt={member.name} />
            </Tooltip>
          ))}
          <Avatar
            style={{
              backgroundColor: "#fde3cf",
              color: "#f56a00",
              cursor: "pointer",
            }}
            icon={<PlusOutlined />}
          />
        </Avatar.Group>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (text, record, index) => (
        <Space size={"middle"}>
          <NavLink
            style={{
              background: "#1890ff",
              borderRadius: "5px",
              padding: "7px",
            }}
          >
            <EditOutlined style={{ color: "#fff" }} />
          </NavLink>
          <NavLink
            style={{
              background: "#ff4d4f",
              borderRadius: "5px",
              padding: "7px",
            }}
            onClick={() => handleDelete(record)}
          >
            <DeleteOutlined style={{ color: "#fff" }} />
          </NavLink>
        </Space>
      ),
    },
  ];

  return (
    <div className="container">
      <h2 className="text-center py-5">Projects Management</h2>
      <div className="project-top d-flex justify-content-between mb-4">
        <Search
          placeholder="Search project name"
          allowClear
          onSearch={onSearch}
          style={{
            width: 250,
          }}
        />
        <NavLink
          to={"/projects/createProject"}
          className="create-task btn btn-primary"
        >
          Create Projectx
        </NavLink>
      </div>
      <Table columns={columns} dataSource={arrData} />
    </div>
  );
};

export default Home;
