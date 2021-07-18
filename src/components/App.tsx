import React, { useRef, useState } from 'react';
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
import SmileScreen from './SmileScreen/SmileScreen';
import { Provider as PaperProvider } from 'react-native-paper';
import ChartsScreen from './ChartsScreen/ChartsScreen';
import appLog from '../AppLog';
import dbtAppTheme from '../theme';
import AppConfig from '../models/AppConfig';

type TabParamList = {
  Home: undefined;
  Help: undefined;
  Smile: undefined;
  Charts: undefined;
  Settings: undefined;
};

const Tab = createMaterialBottomTabNavigator<TabParamList>();

const App = ({ displayName }: { displayName: string }) => {
  const [progressMessage, setProgressMessage] = useState('Starting');
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const appConfig = useRef<AppConfig>({ appDisplayName: displayName }).current;

  useEffect(() => {
    async function initApp() {
      const readSettingsResult = await sqlDb.readSettings();
      setProgressMessage('Loading settings');
      if (readSettingsResult.success && readSettingsResult.data != null) {
        setSettings(readSettingsResult.data);
      } else {
        appLog.error('initApp readSettings error', readSettingsResult);
      }
      setProgressMessage('Loading skills');
      const skillsCount = await sqlDb.getSkillsCount();
      if (skillsCount < 1) {
        const skillsResult = await SkillsApi.getSkillsSummary(settings);
        if (skillsResult.success && skillsResult.data != null) {
          await sqlDb.saveSkills(skillsResult.data);
        }
      }
      setProgressMessage('');
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
        config: appConfig,
        settings,
        updateSettings,
      }}>
      <PaperProvider theme={dbtAppTheme}>
        {loading && <LoadingScreen progressMessage={progressMessage} />}
        {!loading && (
          <>
            <AppHeader />
            <NavigationContainer>
              <Tab.Navigator
                shifting={false}
                barStyle={{ backgroundColor: dbtAppTheme.colors.primary }}>
                <Tab.Screen
                  name="Home"
                  children={() => (
                    <ScreenLayout>
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
                    <ScreenLayout>
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
                  name="Smile"
                  children={() => (
                    <ScreenLayout>
                      <SmileScreen />
                    </ScreenLayout>
                  )}
                  options={{
                    title: 'Smile',
                    tabBarIcon: ({ color }) => (
                      <MaterialCommunityIcons
                        name="emoticon-happy-outline"
                        color={color}
                        size={24}
                      />
                    ),
                  }}
                />
                <Tab.Screen
                  name="Charts"
                  children={() => (
                    <ScreenLayout>
                      <ChartsScreen />
                    </ScreenLayout>
                  )}
                  options={{
                    title: 'Charts',
                    tabBarIcon: ({ color }) => (
                      <MaterialCommunityIcons
                        name="chart-bar"
                        color={color}
                        size={24}
                      />
                    ),
                  }}
                />
                <Tab.Screen
                  name="Settings"
                  children={() => (
                    <ScreenLayout>
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
      </PaperProvider>
    </AppContext.Provider>
  );
};

export default App;
