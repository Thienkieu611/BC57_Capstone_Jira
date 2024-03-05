import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  arrUserD: [],
  projectCategory: {},
};

const CreateProjectReducer = createSlice({
  name: "CreateProjectReducer",
  initialState,
  reducers: {
    getArrUser: (state, action) => {
      state.arrUserD = action.payload;
    },
    getProjectCategory: (state, action) => {
      state.projectCategory = action.payload;
    },
  },
});

export const { getArrUser, getProjectCategory } = CreateProjectReducer.actions;

export default CreateProjectReducer.reducer;
