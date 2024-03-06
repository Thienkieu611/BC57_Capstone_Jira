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
    registerAction: (state, action) => {
      state.userRegister = action.payload;
    },
    logOutAction: (state, action) => {
      state.userLogin = { email: "", accessToken: "" };
      state.isLogin = false;
    },
    
  }
});

export const {loginAction, registerAction, logOutAction} = UserReducer.actions

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

export const registerApiAction = (userRegister) => {
  return async (dispatch) => {
    try {
      const res = await axios({
        url: "https://jiranew.cybersoft.edu.vn/api/Users/signup",
        method: "POST",
        data: {
          email: userRegister.email,
          passWord: userRegister.passWord,
          name: userRegister.name,
          phoneNumber: userRegister.phoneNumber,
        },
      });
      const action = registerAction(res.data.content);
      dispatch(action);

      alert(res.data.message);
      window.location.href = "/login";
    } catch (error) {
      if (error.response?.status === 400) {
        alert("Email already exist!");
        window.location.href = "/register";
      }
    }
  };
};