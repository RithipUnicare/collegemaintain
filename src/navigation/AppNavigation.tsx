import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import MyComplaintsScreen from '../screens/MyComplaintsScreen';
import ReportComplaintScreen from '../screens/ReportComplaintScreen';
import ComplaintDetailScreen from '../screens/ComplaintDetailScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminManageLocationsScreen from '../screens/AdminManageLocationsScreen';
import AdminManageUsersScreen from '../screens/AdminManageUsersScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);

const UserStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="My Complaints List"
      component={MyComplaintsScreen}
      options={{ title: 'Dashboard' }}
    />
    <Stack.Screen name="Complaint Detail" component={ComplaintDetailScreen} />
    <Stack.Screen name="Report" component={ReportComplaintScreen} />
  </Stack.Navigator>
);

const AdminStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Admin Main"
      component={AdminDashboardScreen}
      options={{ title: 'All Complaints' }}
    />
    <Stack.Screen name="Complaint Detail" component={ComplaintDetailScreen} />
  </Stack.Navigator>
);

const UserTabs = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = 'alert-circle';
          if (route.name === 'Dashboard') iconName = 'view-dashboard';
          else if (route.name === 'Report') iconName = 'plus-circle';
          else if (route.name === 'Profile') iconName = 'account';
          return (
            <MaterialCommunityIcons name={iconName} color={color} size={size} />
          );
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={UserStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Report"
        component={ReportComplaintScreen}
        options={{ title: 'Report Issue' }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AdminTabs = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = 'alert-circle';
          if (route.name === 'Complaints') iconName = 'format-list-bulleted';
          else if (route.name === 'Infrastructure')
            iconName = 'office-building';
          else if (route.name === 'Users') iconName = 'account-group';
          else if (route.name === 'Profile') iconName = 'account';
          return (
            <MaterialCommunityIcons name={iconName} color={color} size={size} />
          );
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Complaints"
        component={AdminStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Infrastructure"
        component={AdminManageLocationsScreen}
      />
      <Tab.Screen name="Users" component={AdminManageUsersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNavigation = () => {
  const { accessToken, isAdmin, loading } = useAuth();

  if (loading) return null;

  return (
    <NavigationContainer>
      {accessToken ? isAdmin ? <AdminTabs /> : <UserTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigation;
