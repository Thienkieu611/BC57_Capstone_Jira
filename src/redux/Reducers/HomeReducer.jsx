import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { https } from "../../utils/config";
import { history } from "../..";
import { message } from "antd";

const initialState = {
  arrData: [],
  arrUser: [],
  arrProjectDetail: {},
};

const HomeReducer = createSlice({
  name: "HomeReducer",
  initialState,
  reducers: {
    setArrProjectAction: (state, action) => {
      state.arrData = action.payload;
    },
    setArrUserAction: (state, action) => {
      state.arrUser = action.payload;
    },
    setProjectDetailAction: (state, action) => {
      state.arrProjectDetail = action.payload;
    },
    deleteProjectAction: (state, action) => {
      state.arrData = state.arrData.filter(
        (project) => project.id !== action.payload
      );
    },
  },
});

export const {
  setArrProjectAction,
  setArrUserAction,
  setProjectDetailAction,
  deleteProjectAction,
} = HomeReducer.actions;

export default HomeReducer.reducer;

/* ---------- ACTION THUNK ---------- */
export const getAllProjectApiAction = () => {
  return async (dispatch) => {
    try {
      const res = await https.get("/api/Project/getAllProject");

      const action = setArrProjectAction(res.data.content);
      dispatch(action);
    } catch (error) {
      console.error("Error getAllProject project:", error);
    }
  };
};

export const getAllUserApiAction = () => {
  return async (dispatch) => {
    try {
      const res = await https.get("/api/Users/getUser");

      const action = setArrUserAction(res.data.content);
      dispatch(action);
    } catch (error) {
      console.error("Error getAllUser project:", error);
    }
  };
};

export const getProjectDetailApiAction = (projectId) => {
  return async (dispatch) => {
    try {
      const res = await https.get(
        `/api/Project/getProjectDetail?id=${projectId}`
      );

      const action = setProjectDetailAction(res.data.content);
      dispatch(action);
    } catch (error) {
      console.error("Error getProjectDetail project:", error);
    }
  };
};

export const deleteProjectApiAction = (projectId) => {
  return async (dispatch) => {
    try {
      const res = await https.delete(
        `api/Project/deleteProject?projectId=${projectId}`
      );

      const action = deleteProjectAction(res.data.content);
      dispatch(action);
      // alert("Xoá thành công !");
      message.success("Xoá thành công !");
    } catch (error) {
      if (error.response?.status === 403) {
        // alert("Bạn không được phép xoá Project của người khác !");
        message.error("Bạn không được phép xoá Project của người khác !");
      }
    }
  };
};
