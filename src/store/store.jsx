import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import blogSlice from './slices/blogSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'], // Only persist auth state
};

const rootReducer = combineReducers({
  auth: authSlice,
  blog: blogSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        warnAfter: 128,
      },
      immutableCheck: {
        warnAfter: 128,
      },
    }),
  devTools: __DEV__, // Enable Redux DevTools in development
});

export const persistor = persistStore(store);

// Log store state for debugging
if (__DEV__) {
  store.subscribe(() => {
    console.log('Store state updated:', store.getState());
  });
}
