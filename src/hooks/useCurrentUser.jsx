import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useCurrentUser = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      setLoading(true);

      const [userData, tokenData] = await AsyncStorage.multiGet([
        'user',
        'token',
      ]);

      const userValue = userData[1];
      const tokenValue = tokenData[1];

      if (userValue) {
        setUser(JSON.parse(userValue));
      }

      if (tokenValue) {
        setToken(tokenValue);
      }
    } catch (error) {
      console.error('Error getting current user:', error);
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async newUserData => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(newUserData));
      setUser(newUserData);
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  };

  const updateToken = async newToken => {
    try {
      await AsyncStorage.setItem('token', newToken);
      setToken(newToken);
      return true;
    } catch (error) {
      console.error('Error updating token:', error);
      return false;
    }
  };

  const updateUserField = async (field, value) => {
    try {
      const updatedUser = {
        ...user,
        [field]: value,
      };

      return await updateUser(updatedUser);
    } catch (error) {
      console.error('Error updating user field:', error);
      return false;
    }
  };

  const clearUser = async () => {
    try {
      await AsyncStorage.multiRemove(['user', 'token']);
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  const refreshUser = async () => {
    await getCurrentUser();
  };

  const isUserLoggedIn = () => {
    return user && token;
  };

  const getUserData = () => {
    return {
      user,
      token,
      isAuthenticated: isUserLoggedIn(),
    };
  };

  return {
    user,
    token,
    loading,
    isAuthenticated: isUserLoggedIn(),
    getCurrentUser,
    updateUser,
    updateToken,
    updateUserField,
    clearUser,
    refreshUser,
    getUserData,
  };
};

export default useCurrentUser;
