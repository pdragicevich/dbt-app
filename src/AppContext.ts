import AppSettings from './AppSettings/AppSettings';
import Database from './Database/Database';
import AppConfig from './models/AppConfig';
import React, { useContext } from 'react';

interface AppContextData {
  db: Database;
  settings: AppSettings;
  config: AppConfig;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

const AppContext = React.createContext<AppContextData>({} as AppContextData);

export default AppContext;

export function useAppContext(): AppContextData {
  const appContext = useContext(AppContext);
  if (appContext == null) {
    throw new Error('useAppContext must be used within a AppContextProvider');
  }
  if (
    appContext.db == null ||
    appContext.settings == null ||
    appContext.config == null
  ) {
    const detail = `appContext.db ${typeof appContext.db}, appContext.settings ${typeof appContext.settings}, appContext.config ${typeof appContext.config}`;
    throw new Error(
      'useAppContext context is not initialised properly ' + detail,
    );
  }
  return appContext;
}
