import React, { useContext } from 'react';
import Database from './Database/Database';
import AppSettings from './AppSettings/AppSettings';

interface AppContextData {
  db: Database;
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

const AppContext = React.createContext<AppContextData>({} as AppContextData);

export default AppContext;

export function useAppContext(): AppContextData {
  const appContext = useContext(AppContext);
  if (appContext == null) {
    throw new Error('useAppContext must be used within a AppContextProvider');
  }
  if (appContext.db == null || appContext.settings == null) {
    const detail = `appContext.db ${typeof appContext.db}, appContext.settings ${typeof appContext.settings}`;
    throw new Error(
      'useAppContext context is not initialised properly ' + detail,
    );
  }
  return appContext;
}
