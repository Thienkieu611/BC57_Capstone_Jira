import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutApiAction } from "../redux/Reducers/UserReducer";
import { NavLink } from "react-router-dom";

const Header = () => {
  const { userLogin } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  const logoutUser = () => {
    const action = logoutApiAction(userLogin);
    dispatch(action);
  };

  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-primary">
      <a className="navbar-brand" href="#">
        Navbar
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
        <ul className="navbar-nav me-auto mt-2 mt-lg-0">
          <li className="nav-item">
            <a className="nav-link active" href="#" aria-current="page">
              Home <span className="visually-hidden">(current)</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Link
            </a>
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
              Dropdown
            </a>
            <div className="dropdown-menu" aria-labelledby="dropdownId">
              <a className="dropdown-item" href="#">
                Action 1
              </a>
              <a className="dropdown-item" href="#">
                Action 2
              </a>
            </div>
          </li>
        </ul>
        <form className="d-flex my-2 my-lg-0">
          <input
            className="form-control me-sm-2"
            type="text"
            placeholder="Search"
          />
          <NavLink className="btn btn-light" to={"/login"} onClick={logoutUser}>
            Logout
          </NavLink>
        </form>
      </div>
    </nav>
  );
};

export default Header;
