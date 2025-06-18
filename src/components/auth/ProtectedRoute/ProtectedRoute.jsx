import React, {useEffect, useState, useCallback} from 'react';
import {View, ActivityIndicator, Text} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  useNavigation,
  CommonActions,
  useFocusEffect,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {setAuthData, logoutUser} from '../../../store/slices/authSlice';
import api from '../../../services/api';
import styles from './styles';


const ProtectedRoute = ({
  children,
  requireAuth = true,
  fallbackScreen = 'Login',
  showLoadingText = true,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {isAuthenticated, isLoading, user, token} = useSelector(
    state => state.auth,
  );

  const [isChecking, setIsChecking] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check auth when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (requireAuth) {
        checkAuthStatus();
      } else {
        setIsChecking(false);
      }
    }, [requireAuth]),
  );

  const checkAuthStatus = async () => {
    try {
      setIsChecking(true);
      setAuthError(null);

      // If already authenticated with valid data, skip check
      if (isAuthenticated && user && token) {
        setIsChecking(false);
        return;
      }

      // Check stored authentication data
      const [storedToken, refreshToken, storedUser] =
        await AsyncStorage.multiGet(['token', 'refreshToken', 'user']);

      const tokenValue = storedToken[1];
      const refreshTokenValue = refreshToken[1];
      const userValue = storedUser[1];

      if (tokenValue && userValue) {
        try {
          const parsedUser = JSON.parse(userValue);

          // Validate token with a lightweight API call
          await validateToken(tokenValue);

          // Token is valid, update Redux state
          dispatch(
            setAuthData({
              user: parsedUser,
              token: tokenValue,
              accessToken: tokenValue,
            }),
          );

          setIsChecking(false);
          return;
        } catch (tokenError) {
          console.log('Stored token validation failed, attempting refresh...');
        }
      }

      // Try to refresh token
      if (refreshTokenValue) {
        try {
          await refreshAuthToken(refreshTokenValue);
          setIsChecking(false);
          return;
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
      }

      // No valid authentication found
      await handleAuthFailure();
    } catch (error) {
      console.error('Auth check error:', error);
      setAuthError('Authentication check failed');
      await handleAuthFailure();
    }
  };

  const validateToken = async token => {
    try {
      // Make a lightweight API call to validate token
      await api.get('/auth/validate', {
        headers: {Authorization: `Bearer ${token}`},
      });
      return true;
    } catch (error) {
      throw new Error('Token validation failed');
    }
  };

  const refreshAuthToken = async refreshToken => {
    try {
      const response = await api.post('/auth/refresh-token', {
        refreshToken,
      });

      const responseData = response.data;
      const data = responseData.data || responseData;

      const newToken = data.token || data.accessToken;
      const userData = data.user;
      const newRefreshToken = data.refreshToken;

      if (!newToken) {
        throw new Error('Invalid refresh response structure');
      }

      // Store new authentication data
      const storageData = [['token', newToken]];

      if (userData) {
        storageData.push(['user', JSON.stringify(userData)]);
      }

      if (newRefreshToken) {
        storageData.push(['refreshToken', newRefreshToken]);
      }

      await AsyncStorage.multiSet(storageData);

      // Update Redux state
      dispatch(
        setAuthData({
          user: userData,
          token: newToken,
          accessToken: newToken,
        }),
      );

      Toast.show({
        type: 'success',
        text1: 'Session Refreshed',
        text2: 'Your session has been automatically renewed',
      });

      return true;
    } catch (error) {
      // Clear invalid tokens
      await AsyncStorage.multiRemove(['token', 'refreshToken', 'user']);
      throw error;
    }
  };

  const handleAuthFailure = async () => {
    try {
      // Clear all auth data
      await AsyncStorage.multiRemove(['token', 'refreshToken', 'user']);

      // Clear Redux state
      dispatch(logoutUser());

      // Navigate to auth screen
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: fallbackScreen}],
        }),
      );
    } catch (error) {
      console.error('Error handling auth failure:', error);
    } finally {
      setIsChecking(false);
    }
  };

  // Show loading state
  if (isLoading || isChecking) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        {showLoadingText && (
          <Text style={styles.loadingText}>
            {authError || 'Checking authentication...'}
          </Text>
        )}
      </View>
    );
  }

  // If auth is not required, render children
  if (!requireAuth) {
    return children;
  }

  // If not authenticated, show loading (will redirect)
  if (!isAuthenticated) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Redirecting to login...</Text>
      </View>
    );
  }

  // Render protected content
  return children;
};

export default ProtectedRoute;
