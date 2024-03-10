import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Space, Table } from "antd";
import { NavLink } from "react-router-dom";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import { getAllUserApiAction } from "../redux/Reducers/HomeReducer";

const UserManagement = () => {
  const { arrUser } = useSelector((state) => state.homeReducer);

  const dispatch = useDispatch();

  const getAllUserApi = async () => {
    const action = getAllUserApiAction();
    dispatch(action);
  };

  useEffect(() => {
    getAllUserApi();
  }, []);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const handleChange = (pagination, filters, sorter) => {
    console.log("Various parameters", pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };
  const clearFilters = () => {
    setFilteredInfo({});
  };
  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };
  const setAgeSort = () => {
    setSortedInfo({
      order: "descend",
      columnKey: "age",
    });
  };
  const columns = [
    {
      title: "No.",
      dataIndex: "key",
      rowScope: "row",
      width: "5%",
      render: (text, record, index) => index + 1,
    },

    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "20%",

      filteredValue: filteredInfo.address || null,
      onFilter: (value, record) => record.name.includes(value),
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,

      ...getColumnSearchProps("name"),
    },
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      width: "15%",

      sorter: (a, b) => a.userId - b.userId,
      sortOrder: sortedInfo.columnKey === "userId" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "30%",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: "20%",
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
          >
            <DeleteOutlined style={{ color: "#fff" }} />
          </NavLink>
        </Space>
      ),
    },
  ];
  return (
    <div className="container">
      <h2 className="text-center pt-5 pb-4">Users Management</h2>

      <Space
        style={{
          marginBottom: 20,
        }}
      >
        <Button onClick={clearAll}>Clear filters and sorters</Button>
      </Space>

      <Table columns={columns} dataSource={arrUser} onChange={handleChange} />
    </div>
  );
};

export default UserManagement;
