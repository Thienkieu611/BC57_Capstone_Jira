import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Avatar, Button, Input, Space, Table, Tag, Tooltip } from "antd";
import Highlighter from "react-highlight-words";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";
import { useDispatch, useSelector } from "react-redux";
import { getAllProjectApiAction } from "../redux/Reducers/HomeReducer";

const onSearch = (value, _e, info) => console.log(info?.source, value);
const Home = () => {
  const { arrData } = useSelector((state) => state.homeReducer);

  const dispatch = useDispatch();
  const getAllProjectApi = async () => {
    const action = getAllProjectApiAction();
    dispatch(action);
  };

  useEffect(() => {
    getAllProjectApi();
  }, []);
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
      sorter: (a, b) => a.projectName.length - b.projectName.length,
      sortDirections: ["descend", "ascend"],
      render: (text) => (
        <a className="text-primary text-decoration-none">{text}</a>
      ),
    },
    {
      title: "Category name",
      dataIndex: "categoryName",
      key: "categoryName",
      sorter: (a, b) => a.categoryName.length - b.categoryName.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Creator",
      dataIndex: "creatorName",
      key: "creatorName",
      sorter: (a, b) => a.creatorName.localeCompare(b.creatorName),
      sortDirections: ["descend", "ascend"],
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
        </Avatar.Group>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (text, record, index) => (
        <Space size={"middle"}>
          <a
            style={{
              background: "#1890ff",
              borderRadius: "5px",
              padding: "7px",
            }}
          >
            <EditOutlined style={{ color: "#fff" }} />
          </a>
          <a
            style={{
              background: "#ff4d4f",
              borderRadius: "5px",
              padding: "7px",
            }}
          >
            <DeleteOutlined style={{ color: "#fff" }} />
          </a>
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
        <a className="create-task btn btn-primary">Create Project</a>
      </div>
      <Table columns={columns} dataSource={arrData} />
    </div>
  );
};

export default Home;
