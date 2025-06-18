import React, {useEffect} from 'react';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {store, persistor} from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';
import {ActivityIndicator, View} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
const {whiteTheme} = require('./src/styles/globalStyles');
import {checkStoredAuth} from './src/store/slices/authSlice'; // Add this import

// import ErrorBoundary from './src/components/common/index';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  },
});
const AuthChecker = ({children}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('App: Checking for stored auth data on startup');
    dispatch(checkStoredAuth());
  }, [dispatch]);

  return children;
};

const App = () => {
  return (
    // <ErrorBoundary>
    <Provider store={store} style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <PersistGate
        loading={
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#007bff" />
          </View>
        }
        persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <PaperProvider theme={whiteTheme}>
            <AuthChecker>
              <AppNavigator />
              <Toast />
            </AuthChecker>
          </PaperProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
    // </ErrorBoundary>
  );
};

export default App;
