// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_BASE_URL = 'http://10.0.2.2:5000/api'; // Change this to match your setup


// const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000,
//   withCredentials: true, // for sending cookies if needed
// });

// // Flag to prevent multiple refresh attempts
// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach(prom => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// // api.interceptors.request.use(
// //   async config => {
// //     const token = await AsyncStorage.getItem('token');
// //     if (token) {
// //       config.headers.Authorization = `Bearer ${token}`;
// //     }

// //     if (!(config.data instanceof FormData)) {
// //       config.headers['Content-Type'] = 'application/json';
// //     }

// //     return config;
// //   },
// //   error => Promise.reject(error),
// // );

// // api.interceptors.response.use(
// //   response => response,
// //   async error => {
// //     const originalRequest = error.config;

// //     if (originalRequest.url?.includes('/auth/logout')) {
// //       return Promise.reject(error);
// //     }

// //     if (error.response?.status === 401 && !originalRequest._retry) {
// //       if (isRefreshing) {
// //         return new Promise((resolve, reject) => {
// //           failedQueue.push({resolve, reject});
// //         })
// //           .then(token => {
// //             originalRequest.headers.Authorization = `Bearer ${token}`;
// //             return api(originalRequest);
// //           })
// //           .catch(err => Promise.reject(err));
// //       }

// //       originalRequest._retry = true;
// //       isRefreshing = true;

// //       try {
// //         const response = await axios.post(
// //           `${API_BASE_URL}/auth/refresh-token`,
// //           {},
// //           {withCredentials: true},
// //         );

// //         const tokenData = response.data.data || response.data;
// //         const newToken = tokenData.token || tokenData.accessToken;

// //         if (newToken) {
// //           await AsyncStorage.setItem('token', newToken);
// //           api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
// //           originalRequest.headers.Authorization = `Bearer ${newToken}`;
// //           processQueue(null, newToken);
// //           return api(originalRequest);
// //         } else {
// //           throw new Error('No token in refresh response');
// //         }
// //       } catch (refreshError) {
// //         processQueue(refreshError, null);

// //         await AsyncStorage.removeItem('token');
// //         await AsyncStorage.removeItem('user');

// //         // You can navigate to login screen manually (e.g., using a logout handler or navigation ref)
// //         // Example:
// //         // navigationRef.current?.navigate('Login');

// //         return Promise.reject(refreshError);
// //       } finally {
// //         isRefreshing = false;
// //       }
// //     }

// //     return Promise.reject(error);
// //   },
// // );

// // Update the response interceptor to handle httpOnly cookie refresh
// api.interceptors.response.use(
//   response => response,
//   async error => {
//     const originalRequest = error.config;

//     if (originalRequest.url?.includes('/auth/logout')) {
//       return Promise.reject(error);
//     }

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({resolve, reject});
//         })
//           .then(token => {
//             originalRequest.headers.Authorization = `Bearer ${token}`;
//             return api(originalRequest);
//           })
//           .catch(err => Promise.reject(err));
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         console.log('🔄 Attempting token refresh using httpOnly cookie...');
//         const response = await axios.post(
//           `${API_BASE_URL}/auth/refresh-token`,
//           {}, // Empty body since refreshToken is in httpOnly cookie
//           {
//             withCredentials: true, // Important: This sends the httpOnly cookie
//             headers: {
//               'Content-Type': 'application/json',
//             },
//           }
//         );

//         const tokenData = response.data.data || response.data;
//         const newToken = tokenData.token || tokenData.accessToken;

//         if (newToken) {
//           console.log('✅ Token refreshed successfully using httpOnly cookie');
//           await AsyncStorage.setItem('token', newToken);
//           api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
//           originalRequest.headers.Authorization = `Bearer ${newToken}`;
//           processQueue(null, newToken);
//           return api(originalRequest);
//         } else {
//           throw new Error('No token in refresh response');
//         }
//       } catch (refreshError) {
//         console.error('❌ Token refresh failed:', refreshError);
//         processQueue(refreshError, null);

//         await AsyncStorage.removeItem('token');
//         await AsyncStorage.removeItem('user');

//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   },
// );


// export default api;
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_BASE_URL = 'http://10.0.2.2:5000/api';
const API_BASE_URL = 'http://192.168.168.133:5000/api';


const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');

    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: `${config.baseURL}${config.url}`,
      hasToken: !!token,
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Authorization header set');
    } else {
      console.log('❌ No token found');
    }

    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  error => Promise.reject(error),
);

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (originalRequest.url?.includes('/auth/logout')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({resolve, reject});
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        console.log('🔄 Attempting token refresh...');
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {refreshToken}, // Send refresh token in body
          {
            withCredentials: true,
            headers: {'Content-Type': 'application/json'},
          },
        );

        const newToken = response.data.token;
        const newRefreshToken = response.data.refreshToken;

        if (newToken) {
          console.log('✅ Token refreshed successfully');
          await AsyncStorage.setItem('token', newToken);

          if (newRefreshToken) {
            await AsyncStorage.setItem('refreshToken', newRefreshToken);
          }

          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          processQueue(null, newToken);
          return api(originalRequest);
        } else {
          throw new Error('No token in refresh response');
        }
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        processQueue(refreshError, null);

        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('refreshToken');
        await AsyncStorage.removeItem('user');

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
