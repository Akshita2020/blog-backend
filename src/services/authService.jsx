// import api from './api';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const STORAGE_KEYS = {
//   token: 'token',
//   refreshToken: 'refreshToken',
//   user: 'user',
// };

// const authService = {
//   // login: async credentials => {
//   //   try {
//   //     console.log('AuthService: 🔐 Logging in user:', credentials);
//   //     const response = await api.post('/auth/login', credentials);
//   //     console.log('AuthService: ✅ Login response:', response.data);

//   //     const data = response.data?.data || {};
//   //     const user = data.user;
//   //     const accessToken = data.token; // ✅ fixed
//   //     const refreshToken = data.refreshToken;

//   //     if (accessToken) {
//   //       await AsyncStorage.setItem(STORAGE_KEYS.token, accessToken);
//   //       console.log('AuthService: ✅ Stored accessToken');
//   //     }

//   //     if (refreshToken) {
//   //       await AsyncStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
//   //       console.log('AuthService: ✅ Stored refreshToken');
//   //     }

//   //     if (user) {
//   //       await AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
//   //       console.log('AuthService: ✅ Stored user data');
//   //     }

//   //     return {
//   //       success: true,
//   //       user,
//   //       token: accessToken,
//   //       accessToken,
//   //       refreshToken,
//   //     };
//   //   } catch (error) {
//   //     const err = error.response?.data || {
//   //       message: error.message || 'Login failed',
//   //     };
//   //     console.error('AuthService: ❌ Login error:', err);
//   //     throw err;
//   //   }
//   // },

//   // register: async userData => {
//   //   try {
//   //     console.log('AuthService: 📝 Registering user:', userData);
//   //     const response = await api.post('/auth/register', userData);
//   //     console.log('AuthService: ✅ Register response:', response.data);

//   //     const {user, accessToken, refreshToken} = response.data.data || {};

//   //     if (accessToken) {
//   //       await AsyncStorage.setItem(STORAGE_KEYS.token, accessToken);
//   //       console.log('AuthService: ✅ Stored accessToken');
//   //     }

//   //     if (refreshToken) {
//   //       await AsyncStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
//   //       console.log('AuthService: ✅ Stored refreshToken');
//   //     }

//   //     if (user) {
//   //       await AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
//   //       console.log('AuthService: ✅ Stored user data');
//   //     }

//   //     return {
//   //       success: true,
//   //       user,
//   //       token: accessToken,
//   //       accessToken,
//   //       refreshToken,
//   //     };
//   //   } catch (error) {
//   //     const err = error.response?.data || {
//   //       message: error.message || 'Registration failed',
//   //     };
//   //     console.error('AuthService: ❌ Register error:', err);
//   //     throw err;
//   //   }
//   // },
//   login: async credentials => {
//     try {
//       console.log('AuthService: 🔐 Logging in user:', credentials);
//       const response = await api.post('/auth/login', credentials);
//       console.log('AuthService: ✅ Login response:', response.data);

//       const data = response.data?.data || {};
//       const user = data.user;
//       const accessToken = data.token;

//       if (accessToken) {
//         await AsyncStorage.setItem('token', accessToken);
//         console.log('AuthService: ✅ Stored accessToken');
//       }

//       if (user) {
//         await AsyncStorage.setItem('user', JSON.stringify(user));
//         console.log('AuthService: ✅ Stored user data');
//       }

//       // Note: refreshToken is sent as httpOnly cookie, not in response
//       console.log('AuthService: ℹ️ RefreshToken sent as httpOnly cookie');

//       return {
//         success: true,
//         user,
//         token: accessToken,
//         accessToken,
//         refreshToken: null, // Not available in response, stored as cookie
//       };
//     } catch (error) {
//       const err = error.response?.data || {
//         message: error.message || 'Login failed',
//       };
//       console.error('AuthService: ❌ Login error:', err);
//       throw err;
//     }
//   },

//   register: async userData => {
//     try {
//       console.log('AuthService: 📝 Registering user:', userData);
//       const response = await api.post('/auth/register', userData);
//       console.log('AuthService: ✅ Register response:', response.data);

//       const data = response.data?.data || {};
//       const user = data.user;
//       const accessToken = data.token;

//       if (accessToken) {
//         await AsyncStorage.setItem('token', accessToken);
//         console.log('AuthService: ✅ Stored accessToken');
//       }

//       if (user) {
//         await AsyncStorage.setItem('user', JSON.stringify(user));
//         console.log('AuthService: ✅ Stored user data');
//       }

//       // Note: refreshToken is sent as httpOnly cookie, not in response
//       console.log('AuthService: ℹ️ RefreshToken sent as httpOnly cookie');

//       return {
//         success: true,
//         user,
//         token: accessToken,
//         accessToken,
//         refreshToken: null, // Not available in response, stored as cookie
//       };
//     } catch (error) {
//       const err = error.response?.data || {
//         message: error.message || 'Registration failed',
//       };
//       console.error('AuthService: ❌ Register error:', err);
//       throw err;
//     }
//   },

//   refreshToken: async () => {
//     try {
//       // No need to send refreshToken in body since it's in httpOnly cookie
//       console.log(
//         'AuthService: 🔄 Attempting token refresh using httpOnly cookie',
//       );
//       const response = await api.post('/auth/refresh-token');

//       const data = response.data?.data || response.data;
//       const user = data?.user;
//       const accessToken = data?.token || data?.accessToken;

//       if (accessToken) {
//         await AsyncStorage.setItem('token', accessToken);
//         console.log('AuthService: 🔁 Token refreshed successfully');
//       }

//       // Update user data if provided
//       if (user) {
//         await AsyncStorage.setItem('user', JSON.stringify(user));
//         console.log('AuthService: 🔁 User data updated');
//       }

//       return {
//         success: true,
//         token: accessToken,
//         accessToken,
//         user,
//       };
//     } catch (error) {
//       console.error('AuthService: ❌ Token refresh failed:', error);
//       await AsyncStorage.multiRemove(['token', 'user']);
//       throw error.response?.data || {message: 'Token refresh failed'};
//     }
//   },

//   // Update other methods to not handle refreshToken from AsyncStorage
//   isAuthenticated: async () => {
//     const token = await AsyncStorage.getItem('token');
//     return !!token;
//   },

//   getRefreshToken: async () => {
//     // RefreshToken is stored as httpOnly cookie, not accessible via JS
//     console.log('AuthService: ℹ️ RefreshToken is stored as httpOnly cookie');
//     return null;
//   },

//   getStoredAuthData: async () => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       const user = await AsyncStorage.getItem('user');

//       console.log('AuthService: Stored auth data check:', {
//         hasToken: !!token,
//         hasUser: !!user,
//         tokenLength: token?.length,
//       });

//       return {
//         token,
//         refreshToken: null, // Not stored locally, it's in httpOnly cookie
//         user: user ? JSON.parse(user) : null,
//       };
//     } catch (error) {
//       console.error('AuthService: ❌ Error getting stored auth data:', error);
//       return null;
//     }
//   },

//   // refreshToken: async () => {
//   //   try {
//   //     const refreshTokens = await AsyncStorage.getItem(
//   //       STORAGE_KEYS.refreshToken,
//   //     );
//   //     if (!refreshTokens) throw new Error('No refresh token available');

//   //     const response = await api.post('/auth/refresh-token', {refreshToken});
//   //     // const {accessToken} = response.data.data || {};

//   //     const data = response?.data?.data;

//   //     const user = data?.user;
//   //     const accessToken = data?.token;
//   //     const refreshToken = data?.refreshToken;

//   //     if (accessToken) {
//   //       await AsyncStorage.setItem(STORAGE_KEYS.token, accessToken);
//   //       console.log('AuthService: 🔁 Token refreshed');
//   //     }

//   //     return {
//   //       success: true,
//   //       token: accessToken,
//   //       accessToken,
//   //     };
//   //   } catch (error) {
//   //     console.error('AuthService: ❌ Token refresh failed:', error);
//   //     await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
//   //     throw error.response?.data || {message: 'Token refresh failed'};
//   //   }
//   // },

//   logout: async () => {
//     try {
//       console.log('AuthService: 🚪 Logging out');
//       const response = await api.post('/auth/logout');
//       console.log('AuthService: ✅ Logout response:', response.data);
//       return {
//         success: true,
//         message: response.data.message,
//         data: response.data.data,
//       };
//     } catch (error) {
//       console.error('AuthService: ❌ Logout failed:', error);
//       throw error.response?.data || {message: 'Logout failed'};
//     } finally {
//       await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
//     }
//   },

//   logoutAll: async () => {
//     try {
//       console.log('AuthService: 🚪 Logging out from all devices');
//       const response = await api.post('/auth/logout-all');
//       console.log('AuthService: ✅ Logout-all response:', response.data);
//       return {
//         success: true,
//         message: response.data.message,
//         data: response.data.data,
//       };
//     } catch (error) {
//       console.error('AuthService: ❌ Logout all devices failed:', error);
//       throw error.response?.data || {message: 'Logout from all devices failed'};
//     } finally {
//       await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
//     }
//   },

//   getSessions: async () => {
//     try {
//       const response = await api.get('/auth/sessions');
//       return response.data;
//     } catch (error) {
//       console.error('AuthService: ❌ Get sessions failed:', error);
//       throw error.response?.data || {message: 'Failed to get sessions'};
//     }
//   },

//   revokeSession: async sessionId => {
//     try {
//       const response = await api.delete(`/auth/sessions/${sessionId}`);
//       return response.data;
//     } catch (error) {
//       console.error('AuthService: ❌ Revoke session failed:', error);
//       throw error.response?.data || {message: 'Failed to revoke session'};
//     }
//   },

//   getCurrentUser: async () => {
//     const user = await AsyncStorage.getItem(STORAGE_KEYS.user);
//     return user ? JSON.parse(user) : null;
//   },

//   isAuthenticated: async () => {
//     const token = await AsyncStorage.getItem(STORAGE_KEYS.token);
//     const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.refreshToken);
//     return !!(token || refreshToken);
//   },

//   getToken: async () => {
//     return await AsyncStorage.getItem(STORAGE_KEYS.token);
//   },

//   getRefreshToken: async () => {
//     return await AsyncStorage.getItem(STORAGE_KEYS.refreshToken);
//   },

//   getCurrentToken: async () => {
//     try {
//       const token = await AsyncStorage.getItem(STORAGE_KEYS.token);
//       console.log('AuthService: getCurrentToken → token exists:', !!token);
//       return token;
//     } catch (error) {
//       console.error('AuthService: ❌ Error getting current token:', error);
//       return null;
//     }
//   },

//   getStoredAuthData: async () => {
//     try {
//       const token = await AsyncStorage.getItem(STORAGE_KEYS.token);
//       const refreshToken = await AsyncStorage.getItem(
//         STORAGE_KEYS.refreshToken,
//       );
//       const user = await AsyncStorage.getItem(STORAGE_KEYS.user);

//       console.log('AuthService: Stored auth data:', {
//         hasToken: !!token,
//         hasRefreshToken: !!refreshToken,
//         hasUser: !!user,
//       });

//       return {
//         token,
//         refreshToken,
//         user: user ? JSON.parse(user) : null,
//       };
//     } catch (error) {
//       console.error('AuthService: ❌ Error getting stored auth data:', error);
//       return null;
//     }
//   },
// };

// export {authService};
// export default authService;



import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  token: 'token',
  refreshToken: 'refreshToken',
  user: 'user',
};

const authService = {
  login: async credentials => {
    try {
      console.log('AuthService: 🔐 Logging in user:', credentials);
      const response = await api.post('/auth/login', credentials);
      console.log('AuthService: ✅ Login response:', response.data);

      const data = response.data?.data || {};
      const user = data.user;
      const accessToken = data.token;
      const refreshToken = data.refreshToken; // Now available in response

      if (accessToken) {
        await AsyncStorage.setItem(STORAGE_KEYS.token, accessToken);
        console.log('AuthService: ✅ Stored accessToken');
      }

      if (refreshToken) {
        await AsyncStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
        console.log('AuthService: ✅ Stored refreshToken');
      }

      if (user) {
        await AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
        console.log('AuthService: ✅ Stored user data');
      }

      return {
        success: true,
        user,
        token: accessToken,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      const err = error.response?.data || {
        message: error.message || 'Login failed',
      };
      console.error('AuthService: ❌ Login error:', err);
      throw err;
    }
  },

  register: async userData => {
    try {
      console.log('AuthService: 📝 Registering user:', userData);
      const response = await api.post('/auth/register', userData);
      console.log('AuthService: ✅ Register response:', response.data);

      const data = response.data?.data || {};
      const user = data.user;
      const accessToken = data.token;
      const refreshToken = data.refreshToken; // Now available in response

      if (accessToken) {
        await AsyncStorage.setItem(STORAGE_KEYS.token, accessToken);
        console.log('AuthService: ✅ Stored accessToken');
      }

      if (refreshToken) {
        await AsyncStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
        console.log('AuthService: ✅ Stored refreshToken');
      }

      if (user) {
        await AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
        console.log('AuthService: ✅ Stored user data');
      }

      return {
        success: true,
        user,
        token: accessToken,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      const err = error.response?.data || {
        message: error.message || 'Registration failed',
      };
      console.error('AuthService: ❌ Register error:', err);
      throw err;
    }
  },

  refreshToken: async () => {
    try {
      const refreshToken = await AsyncStorage.getItem(
        STORAGE_KEYS.refreshToken,
      );

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      console.log('AuthService: 🔄 Attempting token refresh...');
      const response = await api.post('/auth/refresh-token', {
        refreshToken, // Send in request body for mobile
      });

      const data = response.data || {};
      const newAccessToken = data.token;
      const newRefreshToken = data.refreshToken;

      if (newAccessToken) {
        await AsyncStorage.setItem(STORAGE_KEYS.token, newAccessToken);
        console.log('AuthService: 🔁 New access token stored');
      }

      if (newRefreshToken) {
        await AsyncStorage.setItem(STORAGE_KEYS.refreshToken, newRefreshToken);
        console.log('AuthService: 🔁 New refresh token stored');
      }

      return {
        success: true,
        token: newAccessToken,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      console.error('AuthService: ❌ Token refresh failed:', error);
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
      throw error.response?.data || {message: 'Token refresh failed'};
    }
  },

  logout: async () => {
    try {
      console.log('AuthService: 🚪 Logging out');
      const response = await api.post('/auth/logout');
      console.log('AuthService: ✅ Logout response:', response.data);
      return {
        success: true,
        message: response.data.message,
        data: response.data.data,
      };
    } catch (error) {
      console.error('AuthService: ❌ Logout failed:', error);
      throw error.response?.data || {message: 'Logout failed'};
    } finally {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    }
  },

  logoutAll: async () => {
    try {
      console.log('AuthService: 🚪 Logging out from all devices');
      const response = await api.post('/auth/logout-all');
      console.log('AuthService: ✅ Logout-all response:', response.data);
      return {
        success: true,
        message: response.data.message,
        data: response.data.data,
      };
    } catch (error) {
      console.error('AuthService: ❌ Logout all devices failed:', error);
      throw error.response?.data || {message: 'Logout from all devices failed'};
    } finally {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    }
  },

  getSessions: async () => {
    try {
      const response = await api.get('/auth/sessions');
      return response.data;
    } catch (error) {
      console.error('AuthService: ❌ Get sessions failed:', error);
      throw error.response?.data || {message: 'Failed to get sessions'};
    }
  },

  revokeSession: async sessionId => {
    try {
      const response = await api.delete(`/auth/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('AuthService: ❌ Revoke session failed:', error);
      throw error.response?.data || {message: 'Failed to revoke session'};
    }
  },

  getCurrentUser: async () => {
    const user = await AsyncStorage.getItem(STORAGE_KEYS.user);
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: async () => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.token);
    const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.refreshToken);
    return !!(token || refreshToken);
  },

  getToken: async () => {
    return await AsyncStorage.getItem(STORAGE_KEYS.token);
  },

  getRefreshToken: async () => {
    return await AsyncStorage.getItem(STORAGE_KEYS.refreshToken);
  },

  getStoredAuthData: async () => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.token);
      const refreshToken = await AsyncStorage.getItem(
        STORAGE_KEYS.refreshToken,
      );
      const user = await AsyncStorage.getItem(STORAGE_KEYS.user);

      console.log('AuthService: Stored auth data check:', {
        hasToken: !!token,
        hasRefreshToken: !!refreshToken,
        hasUser: !!user,
        tokenLength: token?.length,
      });

      return {
        token,
        refreshToken,
        user: user ? JSON.parse(user) : null,
      };
    } catch (error) {
      console.error('AuthService: ❌ Error getting stored auth data:', error);
      return null;
    }
  },
};

export {authService};
export default authService;
