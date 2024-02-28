import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { TOKEN, USER_LOGIN, https } from '../../utils/config';

let userLoginDefault = {
  email: "",
  accessToken: "",
};

if (localStorage.getItem(USER_LOGIN)) {
  userLoginDefault = JSON.parse(localStorage.getItem(USER_LOGIN));
}

const initialState = {
 userLogin: userLoginDefault,
 isLogin: false,
}

const UserReducer = createSlice({
  name: "UserReducer",
  initialState,
  reducers: {
    loginAction: (state, action) => {
      state.userLogin = action.payload;
      state.isLogin = true;
    },
    logOutAction: (state, action) => {
      state.userLogin = { email: "", accessToken: "" };
      state.isLogin = false;
    },
  }
});

export const {loginAction, logOutAction} = UserReducer.actions

export default UserReducer.reducer


//------------------------------ACTION THUNK---------------------------------------------------

export const loginApiAction = (userLogin) => {
  return async (dispatch) => {
    try {
      //call api login
     const res = await https.post('/api/Users/signin', userLogin)
      localStorage.setItem(TOKEN, res.data.content.accessToken);
      localStorage.setItem(USER_LOGIN, JSON.stringify(res.data.content));
      //gửi dữ liệu sau khi thành công vào reducer
      const action = loginAction(res.data.content);
      dispatch(action);
      window.location.href = "/projects";
    } catch (error) {
      if (error.response?.status === 404) {
        alert("Email or password is incorrect!");
        window.location.href = "/login";
      }
    }
  };
};

export const logoutApiAction = (userLogin) => {
  return async (dispatch) => {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(USER_LOGIN);
    const action = logOutAction();
    dispatch(action);
  };
};