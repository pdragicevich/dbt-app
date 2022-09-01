import { name, displayName } from './app.json';
import App from './src/components/App';
import React from 'react';
import { AppRegistry } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);
SQLite.DEBUG(true);

const Main = () => <App displayName={displayName} />;

AppRegistry.registerComponent(name, () => Main);
