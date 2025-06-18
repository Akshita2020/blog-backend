import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  HomeScreen,
  BlogDetailScreen,
  AboutScreen,
} from '../screens/blog/public/index';
import {LoginScreen, RegisterScreen} from '../screens/auth//index';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{title: 'All Blogs'}}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{title: 'About BlogApp'}}
      />
      <Stack.Screen
        name="BlogDetail"
        component={BlogDetailScreen}
        options={{title: 'Blog Detail'}}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{title: 'Sign In'}}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{title: 'Sign Up'}}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
