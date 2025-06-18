import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {authService} from '../../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, {rejectWithValue}) => {
    try {
      console.log('AuthSlice: Attempting login with:', credentials);
      const result = await authService.login(credentials);
      console.log('AuthSlice: Login result:', result);

      if (result.success && result.user) {
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: `Welcome back, ${result.user?.name}!`,
        });

        return {
          user: result.user,
          token: result.accessToken || result.token,
          accessToken: result.accessToken || result.token,
          refreshToken: result.refreshToken,
        };
      }

      throw new Error(result.message || 'Login failed');
    } catch (error) {
      console.error('AuthSlice: Login error:', error);
      const message = error.message || 'Login failed';
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: message,
      });
      return rejectWithValue(message);
    }
  },
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, {rejectWithValue}) => {
    try {
      console.log('AuthSlice: Attempting registration with:', userData);
      const result = await authService.register(userData);
      console.log('AuthSlice: Register result:', result);

      if (result.success && result.user) {
        Toast.show({
          type: 'success',
          text1: 'Registration Successful',
          text2: `Welcome to BlogApp, ${result.user?.name}!`,
        });

        return {
          user: result.user,
          token: result.accessToken || result.token,
          accessToken: result.accessToken || result.token,
          refreshToken: result.refreshToken,
        };
      }

      throw new Error(result.message || 'Registration failed');
    } catch (error) {
      console.error('AuthSlice: Register error:', error);
      const message = error.message || 'Registration failed';
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: message,
      });
      return rejectWithValue(message);
    }
  },
);

export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async (_, {rejectWithValue}) => {
    try {
      const result = await authService.refreshToken();

      if (result.success) {
        return {
          token: result.accessToken || result.token,
          accessToken: result.accessToken || result.token,
          refreshToken: result.refreshToken,
          user: result.user, // In case user data is updated
        };
      }

      throw new Error(result.message || 'Token refresh failed');
    } catch (error) {
      return rejectWithValue(error.message || 'Token refresh failed');
    }
  },
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, {rejectWithValue}) => {
    try {
      const result = await authService.logout();
      Toast.show({
        type: 'success',
        text1: 'Logout Successful',
        text2: result.message || 'See you soon!',
      });
      return result;
    } catch (error) {
      // Even if logout API fails, we should still clear local state
      Toast.show({
        type: 'info',
        text1: 'Logged Out',
        text2: 'Session ended',
      });
      return {};
    }
  },
);

export const logoutAllDevices = createAsyncThunk(
  'auth/logoutAllDevices',
  async (_, {rejectWithValue}) => {
    try {
      const result = await authService.logoutAll();
      Toast.show({
        type: 'success',
        text1: 'Logout Successful',
        text2: `Logged out from ${
          result.data?.devicesLoggedOut || 'all'
        } devices`,
      });
      return result;
    } catch (error) {
      const message = error.message || 'Failed to logout from all devices';
      Toast.show({
        type: 'error',
        text1: 'Logout Failed',
        text2: message,
      });
      return rejectWithValue(message);
    }
  },
);

export const getUserSessions = createAsyncThunk(
  'auth/getUserSessions',
  async (_, {rejectWithValue}) => {
    try {
      const result = await authService.getSessions();
      return result.data || result;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to get sessions');
    }
  },
);

export const revokeUserSession = createAsyncThunk(
  'auth/revokeUserSession',
  async (sessionId, {rejectWithValue}) => {
    try {
      const result = await authService.revokeSession(sessionId);
      Toast.show({
        type: 'success',
        text1: 'Session Revoked',
        text2: 'Device has been logged out',
      });
      return {sessionId, ...result};
    } catch (error) {
      const message = error.message || 'Failed to revoke session';
      Toast.show({
        type: 'error',
        text1: 'Revoke Failed',
        text2: message,
      });
      return rejectWithValue(message);
    }
  },
);

export const checkStoredAuth = createAsyncThunk(
  'auth/checkStoredAuth',
  async (_, {rejectWithValue}) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      const userString = await AsyncStorage.getItem('user');

      if (token && userString) {
        const user = JSON.parse(userString);
        console.log('AuthSlice: Found stored auth data, restoring session');
        return {
          user,
          token,
          accessToken: token,
          refreshToken,
        };
      } else {
        console.log('AuthSlice: No valid stored auth data found');
        return rejectWithValue('No stored auth data');
      }
    } catch (error) {
      console.error('AuthSlice: Error checking stored auth:', error);
      return rejectWithValue(error.message);
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    accessToken: null,
    refreshToken: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
    sessions: [],
    sessionsLoading: false,
  },
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setAuthData: (state, action) => {
      const {user, token, accessToken, refreshToken} = action.payload;
      state.user = user;
      state.token = token || accessToken;
      state.accessToken = accessToken || token;
      state.refreshToken = refreshToken;
      state.isAuthenticated = !!user;
      state.error = null;
    },
    clearAuthData: state => {
      state.user = null;
      state.token = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.sessions = [];
    },
  },
  extraReducers: builder => {
    builder
      // Login
      .addCase(loginUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = !!action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(registerUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = !!action.payload.user;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Refresh Token
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        // Update user data if provided
        if (action.payload.user) {
          state.user = action.payload.user;
        }
        state.error = null;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, state => {
        state.user = null;
        state.token = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
        state.isLoading = false;
        state.sessions = [];
      })
      // Logout All Devices
      .addCase(logoutAllDevices.pending, state => {
        state.isLoading = true;
      })
      .addCase(logoutAllDevices.fulfilled, state => {
        state.user = null;
        state.token = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
        state.isLoading = false;
        state.sessions = [];
      })
      .addCase(logoutAllDevices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Sessions
      .addCase(getUserSessions.pending, state => {
        state.sessionsLoading = true;
      })
      .addCase(getUserSessions.fulfilled, (state, action) => {
        state.sessionsLoading = false;
        state.sessions = action.payload;
      })
      .addCase(getUserSessions.rejected, (state, action) => {
        state.sessionsLoading = false;
        state.error = action.payload;
      })
      // Revoke Session
      .addCase(revokeUserSession.fulfilled, (state, action) => {
        state.sessions = state.sessions.filter(
          session => session.id !== action.payload.sessionId,
        );
      })
      // Check Stored Auth
      .addCase(checkStoredAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = !!action.payload.user;
        state.error = null;
        console.log('AuthSlice: Auth state restored from storage');
      })
      .addCase(checkStoredAuth.rejected, state => {
        console.log('AuthSlice: Failed to restore auth from storage');
        // Don't clear existing state, just log the failure
      });
  },
});

export const {clearError, setAuthData, clearAuthData} = authSlice.actions;
export default authSlice.reducer;
