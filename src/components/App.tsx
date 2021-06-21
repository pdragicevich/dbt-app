import React, { useEffect } from 'react';
import { Appbar } from 'react-native-paper';
import db from '../db';
import HomeScreen from './HomeScreen/HomeScreen';
import SettingsScreen from './SettingsScreen/SettingsScreen';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createMaterialBottomTabNavigator();

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

const App = () => {
  useEffect(() => {
    db.init();
  });

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="DBT thang" subtitle={'Subtitle'} />
        <Appbar.Action icon="magnify" onPress={() => {}} />
        <Appbar.Action icon={MORE_ICON} onPress={() => {}} />
      </Appbar.Header>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarLabel: 'Home',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="home" color={color} size={26} />
              ),
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              tabBarLabel: 'Settings',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="cog" color={color} size={26} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
