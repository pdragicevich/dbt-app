import React, { useState } from 'react';
import HomeScreen from './HomeScreen/HomeScreen';
import SettingsScreen from './SettingsScreen/SettingsScreen';
import AppHeader from './AppHeader';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AppContext from '../AppContext';
import sqlDb from '../Database/SQLDatabase';
import AppSettings, { defaultSettings } from '../AppSettings/AppSettings';
import HelpScreen from './HelpScreen/HelpScreen';
import ScreenLayout from './ScreenLayout';
import LoadingScreen from './LoadingScreen';
import { useEffect } from 'react';
import SkillsApi from '../api/SkillsApi';

type TabParamList = {
  Home: undefined;
  Help: undefined;
  Settings: undefined;
};

const Tab = createMaterialBottomTabNavigator<TabParamList>();

const App = () => {
  const [appMessage, setAppMessage] = useState('');
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initApp() {
      const readSettingsResult = await sqlDb.readSettings();
      setAppMessage('Loading settings');
      if (readSettingsResult.success && readSettingsResult.data != null) {
        setSettings(readSettingsResult.data);
      } else {
        console.error('initApp readSettings error', readSettingsResult);
      }
      setAppMessage('Loading skills');
      const skillsCount = await sqlDb.getSkillsCount();
      console.log('skillsCount', skillsCount);
      if (skillsCount < 1) {
        const skillsResult = await SkillsApi.getSkillsSummary(settings);
        if (skillsResult.success && skillsResult.data != null) {
          await sqlDb.saveSkills(skillsResult.data);
        }
      }
      setAppMessage('');
      setLoading(false);
    }

    initApp();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  async function updateSettings(newSettings: Partial<AppSettings>) {
    console.log('updateSettings', newSettings);
  }

  return (
    <AppContext.Provider
      value={{
        db: sqlDb,
        settings,
        setAppMessage,
        updateSettings,
      }}>
      {loading && <LoadingScreen progressMessage={appMessage} />}
      {!loading && (
        <>
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
                    <MaterialCommunityIcons
                      name="home"
                      color={color}
                      size={24}
                    />
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
                    <MaterialCommunityIcons
                      name="cog"
                      color={color}
                      size={24}
                    />
                  ),
                }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </>
      )}
    </AppContext.Provider>
  );
};

export default App;
