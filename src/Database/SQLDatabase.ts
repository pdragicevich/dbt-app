import { AppState, AppStateStatus } from 'react-native';
import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';
import ChecklistItem from '../models/ChecklistItem';
import Result from '../models/Result';
import SkillSearchResult from '../models/SkillSearchResult';
import { hasAny } from '../utils';
import Database from './Database';
import { DbInit } from './DbInit';

let databaseInstance: SQLiteDatabase | null = null;

async function getDatabase(): Promise<SQLiteDatabase> {
  if (databaseInstance != null) {
    return Promise.resolve(databaseInstance);
  }
  // otherwise: open the database first
  return open();
}

// Open a connection to the database
async function open(): Promise<SQLiteDatabase> {
  if (databaseInstance) {
    return Promise.resolve(databaseInstance);
  }

  // Otherwise, create a new instance
  const db = await SQLite.openDatabase({
    name: 'dbt.db',
    location: 'default',
  });

  // Perform any database initialization or updates, if needed
  const initialiser = new DbInit();
  await initialiser.updateDatabaseTables(db);

  databaseInstance = db;
  return db;
}

async function close(): Promise<void> {
  if (databaseInstance == null) {
    return;
  }
  await databaseInstance.close();
  databaseInstance = null;
}

let appState = 'active';
AppState.addEventListener('change', handleAppStateChange);

// Handle the app going from foreground to background, and vice versa.
function handleAppStateChange(nextAppState: AppStateStatus) {
  if (appState === 'active' && nextAppState.match(/inactive|background/)) {
    // App has moved from the foreground into the background (or become inactive)
    close();
  }
  appState = nextAppState;
}

const findSkill = (searchTerm: string) =>
  select<SkillSearchResult>('SELECT * FROM skills WHERE title LIKE ?', [
    `%${searchTerm}%`,
  ]);

const getChecklistItems = () =>
  select<ChecklistItem>('SELECT * FROM checklist');

async function select<TResult>(sql: string, params?: string[]) {
  const result: TResult[] = [];
  const db = await getDatabase();
  const results = await db.executeSql(sql, params);

  if (!hasAny(results) || !hasAny(results[0].rows)) {
    console.warn('No results');
    return result;
  }

  const rows = results[0].rows;

  for (let i = 0; i < rows.length; i++) {
    result.push(rows.item(i));
  }

  return result;
}

const rebuild = async () => {
  try {
    await close();
    await SQLite.deleteDatabase({ name: 'dbt.db', location: 'default' });
    const db = await getDatabase();
    const initialiser = new DbInit();
    await initialiser.updateDatabaseTables(db);
  } catch (ex) {
    return { success: false, error: ex } as Result;
  }
  return { success: true } as Result;
};

const sqlDatabase: Database = {
  findSkill,
  getChecklistItems,
  rebuild,
};

export default sqlDatabase;
