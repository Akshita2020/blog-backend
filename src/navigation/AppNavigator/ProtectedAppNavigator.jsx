import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import MainTabNavigator from '../TabNavigators/MainTabs';
import BlogDetailScreen from '../../screens/blog/public/BlogDetailScreen/BlogDetailScreen';
import EditBlogScreen from '../../screens/blog/protected/EditBlogScreen/EditBlogScreen';
import CreateBlogScreen from '../../screens/blog/protected/CreateBlogScreen/CreateBlogScreen';
import MyBlogsScreen from '../../screens/blog/protected/MyBlogsScreen/MyBlogsScreen';

const Stack = createNativeStackNavigator();

const ProtectedAppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
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
        name="MyBlogs"
        component={MyBlogsScreen}
        options={{
          title: 'My Blogs',
          headerShown: false, 
        }}
      />
      <Stack.Screen
        name="CreateBlog"
        component={CreateBlogScreen}
        options={{
          headerShown: true,
          title: 'Create Blog',
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
        name="EditBlog"
        component={EditBlogScreen}
        options={{
          headerShown: true,
          title: 'Edit Blog',
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

export default ProtectedAppNavigator;
