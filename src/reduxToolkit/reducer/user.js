import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  userInfo: {},
  userToken: '',
  userNotifications: [],
};
const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserToken(state, {payload}) {
      return {
        ...state,
        userToken: payload,
      };
    },
    setUser(state, {payload}) {
      return {
        ...state,
        userInfo: payload,
      };
    },
    setUserNotifications(state, {payload}) {
      return {
        ...state,
        userNotifications: payload,
      };
    },
    logOutUser(state, {payload}) {
      return {
        userInfo: {},
        userToken: '',
      };
    },
  },
});

export const {setUserToken, setUser, setUserNotifications, logOutUser} = user.actions;
const userReducer = user.reducer;

export default userReducer;
