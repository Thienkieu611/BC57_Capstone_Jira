import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutApiAction } from "../redux/Reducers/UserReducer";
import { NavLink } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Space } from "antd";

const Header = () => {
  const { userLogin } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  const logoutUser = () => {
    const action = logoutApiAction(userLogin);
    dispatch(action);
  };

  return (
    <div className="header bg-white text-primary container-fluid shadow px-5 fixed left-0 top-0 w-full d-flex justify-content-between">
      <nav className="navbar navbar-expand-sm text-primary p-0">
        <a className="navbar-brand" href="#">
          <img
            src="https://www.ecobit.nl/portal-content-website/koppelingen/jira%20software.png"
            alt="..."
            style={{ maxWidth: "500px", maxHeight: "50px" }}
          />
        </a>
        <button
          className="navbar-toggler d-lg-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapsibleNavId"
          aria-controls="collapsibleNavId"
          aria-expanded="false"
          aria-label="Toggle navigation"
        />
        <div className="collapse navbar-collapse" id="collapsibleNavId">
          <ul className="navbar-nav me-auto mt-2 mt-lg-0 d-flex">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="dropdownId"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Projects
              </a>
              <div className="dropdown-menu" aria-labelledby="dropdownId">
                <a className="dropdown-item" href="#">
                  View all projects
                </a>
                <a className="dropdown-item" href="#">
                  Create projects
                </a>
              </div>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="dropdownId"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Users
              </a>
              <div className="dropdown-menu" aria-labelledby="dropdownId">
                <a className="dropdown-item" href="#">
                  View all users
                </a>
              </div>
            </li>
            <li className="nav-item">
              <NavLink to={"/projects/createTask"} className="nav-link active">
                Create Task <span className="visually-hidden">(current)</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
      <div className="nav-right d-flex align-items-center">
        <div className="nav-item dropdown m-3">
          <a
            className="nav-link"
            href="#"
            id="dropdownId3"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <i class="fa fa-cog"></i>
          </a>
          <div className="dropdown-menu" aria-labelledby="dropdownId3">
            <a className="dropdown-item" href="#">
              User management
            </a>
            <a className="dropdown-item" href="#">
              Projects
            </a>
          </div>
        </div>
        <div className="nav-item dropdown">
          <a
            className="nav-link"
            href="#"
            id="dropdownId"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <img src={userLogin.avatar} alt="" className="mx-2" style={{borderRadius: "50%", width: "2.5rem"}}/>
            {userLogin.email}
          </a>
          <div className="dropdown-menu" aria-labelledby="dropdownId">
          <NavLink
              className="btn btn-light dropdown-item"
              to={"my-profile"}
            >
              My Profile
            </NavLink>
            <NavLink
              className="btn btn-light dropdown-item"
              to={"/login"}
              onClick={logoutUser}
            >
              Logout
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
