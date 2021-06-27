/**
 * @format
 */

import SQLite from 'react-native-sqlite-storage';
import React from 'react';
import { AppRegistry } from 'react-native';
import App from './src/components/App';
import { name as appName } from './app.json';
import { Provider as PaperProvider } from 'react-native-paper';
import theme from './src/theme';

SQLite.enablePromise(true);
SQLite.DEBUG(true);

const Main = () => (
  <PaperProvider theme={theme}>
    <App />
  </PaperProvider>
);

AppRegistry.registerComponent(appName, () => Main);
