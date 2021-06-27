import React, { useContext } from 'react';
import Database from './Database/Database';

const DbContext = React.createContext<Database | null>(null);

export default DbContext;

export function useDatabase(): Database {
  const database = useContext(DbContext);
  if (database == null) {
    throw new Error('useDatabase must be used within a ListContextProvider');
  }
  return database;
}
