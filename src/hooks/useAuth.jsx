import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import Toast from 'react-native-toast-message';
import {
  loginUser,
  registerUser,
  logoutUser,
  logoutAllDevices,
  getUserSessions,
  revokeUserSession,
  clearError,
} from '../store/slices/authSlice';
import {clearError as clearBlogError} from '../store/slices/blogSlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {
    user,
    isLoading,
    error,
    isAuthenticated,
    token,
    accessToken,
    refreshToken,
    sessions,
    sessionsLoading,
  } = useSelector(state => state.auth);

  const login = useCallback(
    async credentials => {
      try {
        const result = await dispatch(loginUser(credentials)).unwrap();

        navigation.reset({
          index: 0,
          routes: [{name: 'MainTabs'}],
        });

        return {success: true, data: result};
      } catch (error) {
        console.error('Login error in useAuth:', error);
        return {success: false, error: error};
      }
    },
    [dispatch, navigation],
  );

  const register = useCallback(
    async userData => {
      try {
        const result = await dispatch(registerUser(userData)).unwrap();

        navigation.reset({
          index: 0,
          routes: [{name: 'MainTabs'}],
        });

        return {success: true, data: result};
      } catch (error) {
        console.error('Register error in useAuth:', error);
        return {success: false, error: error};
      }
    },
    [dispatch, navigation],
  );

  const logout = useCallback(async () => {
    try {
      // Clear blog data when logging out
      dispatch(clearBlogError());

      // Perform logout from current device
      await dispatch(logoutUser()).unwrap();

      // Navigate to auth screen
      navigation.reset({
        index: 0,
        routes: [{name: 'Auth'}],
      });

      return {success: true};
    } catch (logoutErr) {
      console.error('Logout error:', logoutErr);
      // Even if logout fails, clear local state and navigate
      navigation.reset({
        index: 0,
        routes: [{name: 'Auth'}],
      });
      return {success: true};
    }
  }, [dispatch, navigation]);

  const logoutFromAllDevices = useCallback(async () => {
    try {
      // Clear blog data when logging out
      dispatch(clearBlogError());

      // Perform logout from all devices
      await dispatch(logoutAllDevices()).unwrap();

      // Navigate to auth screen
      navigation.reset({
        index: 0,
        routes: [{name: 'Auth'}],
      });

      return {success: true};
    } catch (logoutErr) {
      console.error('Logout all devices error:', logoutErr);
      return {success: false, error: logoutErr};
    }
  }, [dispatch, navigation]);

  const getSessions = useCallback(async () => {
    try {
      const result = await dispatch(getUserSessions()).unwrap();
      return {success: true, data: result};
    } catch (error) {
      console.error('Get sessions error:', error);
      return {success: false, error: error};
    }
  }, [dispatch]);

  const revokeSession = useCallback(
    async sessionId => {
      try {
        await dispatch(revokeUserSession(sessionId)).unwrap();
        return {success: true};
      } catch (error) {
        console.error('Revoke session error:', error);
        return {success: false, error: error};
      }
    },
    [dispatch],
  );

  const checkAuthStatus = useCallback(() => {
    return isAuthenticated && user && (token || accessToken);
  }, [isAuthenticated, user, token, accessToken]);

  const requireAuth = useCallback(
    callback => {
      if (!checkAuthStatus()) {
        Toast.show({
          type: 'error',
          text1: 'Authentication Required',
          text2: 'Please log in to continue',
        });
        navigation.navigate('Login');
        return false;
      }

      if (callback) callback();
      return true;
    },
    [checkAuthStatus, navigation],
  );

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    user,
    isLoading,
    error,
    isAuthenticated,
    token: token || accessToken,
    accessToken,
    refreshToken,
    sessions,
    sessionsLoading,

    // Actions
    login,
    register,
    logout,
    logoutFromAllDevices,
    getSessions,
    revokeSession,

    // Utilities
    checkAuthStatus,
    requireAuth,
    clearError: clearAuthError,

    // User info shortcuts
    userId: user?.id || user?._id,
    userName: user?.name,
    userEmail: user?.email,
    userAvatar: user?.avatar,
  };
};

export default useAuth;
