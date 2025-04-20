import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  rememberMe: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setRememberMe: (state, action) => {
      state.rememberMe = action.payload;
    },
    restoreAuthState: (state, action) => {
      state.user = action.payload.user;
      state.rememberMe = action.payload.rememberMe;
      state.isAuthenticated = !!action.payload.user;
    }
  },
});

export const { loginSuccess, logout, setRememberMe, restoreAuthState } = authSlice.actions;
export default authSlice.reducer;
