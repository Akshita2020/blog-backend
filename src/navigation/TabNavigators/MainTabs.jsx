import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Home, User, BookOpen, Info} from 'lucide-react-native';

// Import screens
import {HomeScreen, AboutScreen} from '../../screens/blog/public/index';
import {MyBlogsScreen, ProfileScreen} from '../../screens/blog/protected/index';

const Tab = createBottomTabNavigator();

function TabBarIcon({route, color, size}) {
  let IconComponent;

  switch (route.name) {
    case 'HomeTab':
      IconComponent = Home;
      break;
    case 'About':
      IconComponent = Info;
      break;
    case 'MyBlogs':
      IconComponent = BookOpen;
      break;
    case 'Profile':
      IconComponent = User;
      break;
    default:
      IconComponent = Home;
  }

  return <IconComponent size={size} color={color} />;
}

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused, color, size}) => (
          <TabBarIcon route={route} color={color} size={size} />
        ),
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: 'About',
          tabBarLabel: 'About',
        }}
      />
      <Tab.Screen
        name="MyBlogs"
        component={MyBlogsScreen}
        options={{
          title: 'My Blogs',
          tabBarLabel: 'My Blogs',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
