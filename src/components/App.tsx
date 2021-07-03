import React, { useState } from 'react';
import HomeScreen from './HomeScreen/HomeScreen';
import SettingsScreen from './SettingsScreen/SettingsScreen';
import AppHeader from './AppHeader';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AppContext from '../AppContext';
import sqlDb from '../Database/SQLDatabase';
import inMemorySettings from '../AppSettings/InMemorySettings';
import HelpScreen from './HelpScreen/HelpScreen';
import ScreenLayout from './ScreenLayout';

type TabParamList = {
  Home: undefined;
  Help: undefined;
  Gratitude: undefined;
  Settings: undefined;
};

const Tab = createMaterialBottomTabNavigator<TabParamList>();

const App = () => {
  const [appMessage, setAppMessage] = useState('This is a message');

  return (
    <AppContext.Provider
      value={{
        db: sqlDb,
        settings: inMemorySettings,
        setAppMessage: setAppMessage,
      }}>
      <AppHeader />
      <NavigationContainer>
        <Tab.Navigator shifting={false}>
          <Tab.Screen
            name="Home"
            children={() => (
              <ScreenLayout appMessage={appMessage}>
                <HomeScreen />
              </ScreenLayout>
            )}
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="home" color={color} size={24} />
              ),
            }}
          />
          <Tab.Screen
            name="Help"
            children={() => (
              <ScreenLayout appMessage={appMessage}>
                <HelpScreen />
              </ScreenLayout>
            )}
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
            children={() => (
              <ScreenLayout appMessage={appMessage}>
                <SettingsScreen />
              </ScreenLayout>
            )}
            options={{
              title: 'Settings',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="cog" color={color} size={24} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
};

export default App;
