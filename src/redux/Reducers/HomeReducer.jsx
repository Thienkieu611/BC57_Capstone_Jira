import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { https } from "../../utils/config";

const initialState = {
  arrData: [],
};

const HomeReducer = createSlice({
  name: "HomeReducer",
  initialState,
  reducers: {
    setArrProjectAction: (state, action) => {
      state.arrData = action.payload;
    },
  },
});

export const { setArrProjectAction } = HomeReducer.actions;

export default HomeReducer.reducer;

/* ---------- ACTION THUNK ---------- */
export const getAllProjectApiAction = () => {
  return async (dispatch) => {
    const res = await https.get("/api/Project/getAllProject");

    const action = setArrProjectAction(res.data.content);
    dispatch(action);
  };
};
