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
 userArr: [],
}

const UserReducer = createSlice({
  name: "UserReducer",
  initialState,
  reducers: {
    loginAction: (state, action) => {
      state.userLogin = action.payload;
      state.isLogin = true;
    },
    loginFacebookAction: (state, action) => {
      state.isLogin = true;
    },
    registerAction: (state, action) => {
      state.userRegister = action.payload;
    },
    logOutAction: (state, action) => {
      state.userLogin = { email: "", accessToken: "" };
      state.isLogin = false;
    },
    updateProfileAction: (state, action) => {
      //console.log('Action payload:', action.payload);
      state.userProfile = action.payload;
    },
    setUserArrayAction: (state, action) => {
      state.userArr = action.payload
    }

  }
});

export const {loginAction, registerAction, logOutAction, loginFacebookAction, updateProfileAction, setUserArrayAction} = UserReducer.actions

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

export const loginFacebookApiAction = (response) => {
  return async (dispatch) => {
    try {
      const res = await axios({
        url: "https://jiranew.cybersoft.edu.vn/api/Users/facebooklogin",
        method: "POST",
        data: {
          facebookToken: response.accessToken,
        },
      });
      console.log("res", res);
      localStorage.setItem(TOKEN, res.data.content.accessToken);
      localStorage.setItem(USER_LOGIN, JSON.stringify(res.data.content));
      const action = loginFacebookAction(res.data.content);
      dispatch(action);
      window.location.href = "/";
    } catch (error) {
      if (error.response?.status === 404) {
        alert("Login failed");
        window.location.href = "/login";
      }
    }
  };
}

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

export const updateProfileApiAction = (updatedProfile) => {
  return async (dispatch) => {
    try {
      const res = await https.put('/api/Users/editUser', {
        id: updatedProfile.id,
        passWord: updatedProfile.passWord,
        email: updatedProfile.email,
          name: updatedProfile.name,
          phoneNumber: updatedProfile.phoneNumber,
      });
      dispatch(updateProfileAction(res.data.content));
      alert("Account is updated successfully!");
      window.location.href = "/projects/my-profile";
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };
};

export const getAllUsersApiAction = () => {
  return async (dispatch) => {
    const res = await https.get('/api/Users/getUser')
    const action = setUserArrayAction(res.data.content)
    dispatch(action)
  }
}