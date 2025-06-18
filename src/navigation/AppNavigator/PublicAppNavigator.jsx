import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import PublicTabNavigator from '../TabNavigators/PublicTabNavigator';
import BlogDetailScreen from '../../screens/blog/public/BlogDetailScreen/BlogDetailScreen';
import {LoginScreen, RegisterScreen} from '../../screens/auth/index';

const Stack = createNativeStackNavigator();

const PublicAppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="PublicTabs"
        component={PublicTabNavigator}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="BlogDetail"
        component={BlogDetailScreen}
        options={{
          headerShown: true,
          title: 'Blog Details',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTitleStyle: {
            color: '#111827',
            fontSize: 18,
            fontWeight: '600',
          },
          headerTintColor: '#3B82F6',
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerShown: true,
          title: 'Create Account',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTitleStyle: {
            color: '#111827',
            fontSize: 18,
            fontWeight: '600',
          },
          headerTintColor: '#3B82F6',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: true,
          title: 'Create Account',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTitleStyle: {
            color: '#111827',
            fontSize: 18,
            fontWeight: '600',
          },
          headerTintColor: '#3B82F6',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};

export default PublicAppNavigator;
