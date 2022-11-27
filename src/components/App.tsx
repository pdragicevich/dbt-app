import AppContext, { SnackbarContext } from '../AppContext';
import appLog from '../AppLog';
import AppSettings, { defaultSettings } from '../AppSettings/AppSettings';
import sqlDb from '../Database/SQLDatabase';
import SkillsApi from '../api/SkillsApi';
import AppConfig from '../models/AppConfig';
import dbtAppTheme from '../theme';
import AppHeader from './AppHeader';
import ChartsScreen from './ChartsScreen/ChartsScreen';
import HelpScreen from './HelpScreen/HelpScreen';
import HomeScreen from './HomeScreen/HomeScreen';
import LoadingScreen from './LoadingScreen';
import ScreenLayout from './ScreenLayout';
import SettingsScreen from './SettingsScreen/SettingsScreen';
import SmileScreen from './SmileScreen/SmileScreen';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { Provider as PaperProvider, Snackbar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export type TabParamList = {
  Home: undefined;
  Help: undefined;
  Smile: undefined;
  Charts: undefined;
  Settings: undefined;
};

const Tab = createMaterialBottomTabNavigator<TabParamList>();

interface AppProps {
  displayName: string;
}

interface AppState {
  progressMessage: string;
  settings: AppSettings;
  loading: boolean;
  snackbar?: SnackbarContext;
}

class App extends React.Component<AppProps, AppState> {
  private appConfig: AppConfig = { appDisplayName: '' };

  constructor(props: AppProps) {
    super(props);
    this.state = {
      progressMessage: 'Starting',
      settings: defaultSettings,
      loading: true,
    };
    this.appConfig = { appDisplayName: props.displayName };
  }

  setProgressMessage = (progressMessage: string, loading?: boolean) => {
    this.setState(state => {
      if (loading != null) {
        return { ...state, loading, progressMessage };
      } else {
        return { ...state, progressMessage };
      }
    });
  };

  async initApp() {
    const readSettingsResult = await sqlDb.readSettings();
    this.setProgressMessage('Loading settings');
    if (readSettingsResult.success && readSettingsResult.data != null) {
      this.setState(state => {
        const settings = readSettingsResult.data;
        if (settings != null) {
          return { ...state, settings };
        } else {
          return { ...state };
        }
      });
    } else {
      appLog.error('initApp readSettings error', readSettingsResult);
    }
    this.setProgressMessage('Loading skills');
    const skillsCount = await sqlDb.getSkillsCount();
    if (skillsCount < 1) {
      const skillsResult = await SkillsApi.getSkillsSummary(
        this.state.settings,
      );
      if (skillsResult.success && skillsResult.data != null) {
        await sqlDb.saveSkills(skillsResult.data);
      }
    }
    this.setProgressMessage('', false);
  }

  updateSettings = async (newSettings: Partial<AppSettings>) => {
    console.log('updateSettings', newSettings);
  };

  setSnackbar = (data: SnackbarContext | null) => {
    this.setState(prevState => {
      if (!data) {
        return {
          ...prevState,
          snackbar: undefined,
        };
      }
      return {
        ...prevState,
        snackbar: data,
      };
    });
  };

  componentDidMount() {
    this.initApp();
  }

  render() {
    return (
      <AppContext.Provider
        value={{
          db: sqlDb,
          config: this.appConfig,
          settings: this.state.settings,
          updateSettings: this.updateSettings,
          snackbar: this.state.snackbar,
          setSnackbar: this.setSnackbar,
        }}
      >
        <PaperProvider theme={dbtAppTheme}>
          {this.state.loading && (
            <LoadingScreen progressMessage={this.state.progressMessage} />
          )}
          {!this.state.loading && (
            <>
              <AppHeader />
              <NavigationContainer>
                <Tab.Navigator
                  shifting={false}
                  barStyle={{ backgroundColor: dbtAppTheme.colors.primary }}
                >
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
                    children={() => <SettingsScreen />}
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
          <Snackbar
            visible={!!this.state.snackbar?.message}
            onDismiss={() => this.setSnackbar(null)}
            action={{
              label: this.state.snackbar?.label ?? 'Ok',
              onPress: () => this.setSnackbar(null),
            }}
            duration={
              this.state.snackbar?.durationMs ??
              this.state.settings.snackbarDurationMs
            }
          >
            {this.state.snackbar?.message}
          </Snackbar>
        </PaperProvider>
      </AppContext.Provider>
    );
  }
}

export default App;
