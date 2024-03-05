import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./Reducers/UserReducer";
import CreateProjectReducer from "./Reducers/CreateProjectReducer";

export const store = configureStore({
  reducer: {
    userReducer: UserReducer,
    CreateProjectReducer,
  },
});
