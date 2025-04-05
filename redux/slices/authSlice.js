import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  user: null, // Lưu thông tin người dùng
  isAuthenticated: false, // Trạng thái đăng nhập
  rememberMe: false, // Trạng thái nhớ tài khoản
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      if (state.rememberMe) {
        AsyncStorage.setItem('user', JSON.stringify(action.payload));
        AsyncStorage.setItem('rememberMe', 'true');
      }
    },
    logout: (state) => {
      if (!state.rememberMe) {
        state.user = null;
        AsyncStorage.removeItem('user'); // Xóa khỏi AsyncStorage nếu không nhớ tài khoản
        AsyncStorage.removeItem('password'); // Xóa mật khẩu nếu không nhớ
        AsyncStorage.setItem('rememberMe', 'false');
      }
      state.isAuthenticated = false;
    },
    setRememberMe: (state, action) => {
      state.rememberMe = action.payload;
      AsyncStorage.setItem('rememberMe', action.payload.toString());
    },
    loadAuthState: (state) => {
      AsyncStorage.getItem('rememberMe').then((value) => {
        state.rememberMe = value === 'true';
        if (state.rememberMe) {
          AsyncStorage.getItem('user').then((user) => {
            if (user) {
              state.user = JSON.parse(user);
              state.isAuthenticated = true;
            }
          });
        }
      });
    },
  },
});

export const { loginSuccess, logout, setRememberMe, loadAuthState } = authSlice.actions;
export default authSlice.reducer;
