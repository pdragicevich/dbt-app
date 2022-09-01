import SettingsMain from './SettingsMain';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

const Stack = createNativeStackNavigator();

const SettingsScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="main" component={SettingsMain} />
    </Stack.Navigator>
  );
};

export default SettingsScreen;
