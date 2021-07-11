/**
 * @format
 */

import SQLite from 'react-native-sqlite-storage';
import React from 'react';
import { AppRegistry } from 'react-native';
import App from './src/components/App';
import { name as appName } from './app.json';

SQLite.enablePromise(true);
SQLite.DEBUG(true);

const Main = () => <App />;

AppRegistry.registerComponent(appName, () => Main);
