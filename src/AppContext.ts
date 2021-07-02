import React, { useContext } from 'react';
import Database from './Database/Database';
import AppSettings from './AppSettings/AppSettings';

interface AppContextData {
  database: Database | null;
  settings: AppSettings | null;
}

const AppContext = React.createContext<AppContextData>({
  database: null,
  settings: null,
});

export default AppContext;

export function useDatabase(): Database {
  const appContext = useContext(AppContext);
  if (appContext == null || appContext.database == null) {
    throw new Error('useDatabase must be used within a ListContextProvider');
  }
  return appContext.database;
}

export function useSettings(): AppSettings {
  const appContext = useContext(AppContext);
  if (appContext == null || appContext.settings == null) {
    throw new Error('useSettings must be used within a ListContextProvider');
  }
  return appContext.settings;
}
