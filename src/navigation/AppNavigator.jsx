import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {ActivityIndicator, View} from 'react-native';

// Import the correct navigators
import PublicAppNavigator from './AppNavigator/PublicAppNavigator';
import ProtectedAppNavigator from './AppNavigator/ProtectedAppNavigator';

const AppNavigator = () => {
  const {isAuthenticated, loading} = useSelector(state => {
    return state.auth || {isAuthenticated: false, loading: false};
  });

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <ProtectedAppNavigator /> : <PublicAppNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
