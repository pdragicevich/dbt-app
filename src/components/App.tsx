import React from 'react';
import HomeScreen from './HomeScreen/HomeScreen';
import SettingsScreen from './SettingsScreen/SettingsScreen';
import AppHeader from './AppHeader';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DbContext from '../DbContext';
import sqlDb from '../Database/SQLDatabase';
import HelpScreen from './HelpScreen/HelpScreen';

type TabParamList = {
  Home: undefined;
  Help: undefined;
  Gratitude: undefined;
  Settings: undefined;
};

const Tab = createMaterialBottomTabNavigator<TabParamList>();

const App = () => {
  return (
    <DbContext.Provider value={sqlDb}>
      <AppHeader />
      <NavigationContainer>
        <Tab.Navigator shifting={false}>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="home" color={color} size={24} />
              ),
            }}
          />
          <Tab.Screen
            name="Help"
            component={HelpScreen}
            options={{
              title: 'Help!',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="hospital-box"
                  color={color}
                  size={24}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              title: 'Settings',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="cog" color={color} size={24} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </DbContext.Provider>
  );
};

export default App;
