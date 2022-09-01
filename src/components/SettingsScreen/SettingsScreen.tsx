import ScreenLayout from '../ScreenLayout';
import SettingsMain from './SettingsMain';
import SettingsTodo from './SettingsTodo/SettingsTodo';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

export type SettingsScreenProps = {
  navigation: {
    navigate: (route: 'main' | 'todo') => void;
  };
};

const Stack = createNativeStackNavigator();

const SettingsScreen = () => {
  return (
    <Stack.Navigator
      initialRouteName="main"
      defaultScreenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="main"
        options={{ title: 'Settings' }}
        children={({ navigation }) => (
          <ScreenLayout>
            <SettingsMain navigation={navigation} />
          </ScreenLayout>
        )}
      />
      <Stack.Screen
        name="todo"
        options={{ title: 'Customise To-Do List' }}
        children={() => (
          <ScreenLayout>
            <SettingsTodo />
          </ScreenLayout>
        )}
      />
    </Stack.Navigator>
  );
};

export default SettingsScreen;
