import { AppState, AppStateStatus } from 'react-native';
import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';
import ChecklistItem from '../models/ChecklistItem';
import { result } from '../models/Result';
import SkillSearchResult from '../models/SkillSearchResult';
import { guardedTrim, hasAny, unixDateNow, unixDateToday } from '../utils';
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
  select<ChecklistItem>(
    `SELECT c.id, c.item, l.logged FROM checklist c
LEFT OUTER JOIN checklist_log l ON c.id = l.checklist_id AND l.logged = ?`,
    [unixDateToday()],
    x => {
      return {
        id: x.id,
        item: x.item,
        checked: x.logged != null,
      };
    },
  );

async function select<TResult>(
  sql: string,
  params?: Array<string | number>,
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  converter?: (r: any) => TResult,
) {
  const returnedRows: TResult[] = [];
  const db = await getDatabase();
  const results = await db.executeSql(sql, params);

  if (!hasAny(results) || !hasAny(results[0].rows)) {
    return returnedRows;
  }

  const rows = results[0].rows;

  for (let i = 0; i < rows.length; i++) {
    if (converter) {
      returnedRows.push(converter(rows.item(i)));
    } else {
      returnedRows.push(rows.item(i));
    }
  }

  return returnedRows;
}

const rebuild = async () => {
  try {
    await close();
    await SQLite.deleteDatabase({ name: 'dbt.db', location: 'default' });
    const db = await getDatabase();
    const initialiser = new DbInit();
    await initialiser.updateDatabaseTables(db);
  } catch (ex) {
    return result(false, ex);
  }
  return result(true);
};

const recordChecklistCheck = async (id: number, checked: boolean) => {
  try {
    const db = await getDatabase();
    const today = unixDateToday();

    await db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM checklist_log WHERE checklist_id = ? AND logged = ?',
        [id, today],
      );
      if (checked) {
        tx.executeSql(
          'INSERT INTO checklist_log(checklist_id, logged) VALUES (?,?)',
          [id, today],
        );
      }
    });
    return result(true);
  } catch (ex) {
    return result(false, ex);
  }
};

const saveMood = async (mood: number) => {
  try {
    const db = await getDatabase();
    const now = unixDateNow();

    await db.executeSql('INSERT INTO mood_log(logged,mood) VALUES (?,?)', [
      now,
      mood,
    ]);
    return result(true);
  } catch (ex) {
    return result(false, ex);
  }
};

const saveGratitude = async (lines: string[]) => {
  try {
    const db = await getDatabase();
    const now = unixDateNow();

    await db.transaction(tx => {
      for (const line of lines) {
        const trimmed = guardedTrim(line);
        if (trimmed.length > 0) {
          tx.executeSql('INSERT INTO gratitude_log(date, text) VALUES (?, ?)', [
            now,
            trimmed,
          ]);
        }
      }
    });

    return result(true);
  } catch (ex) {
    return result(false, ex);
  }
};

const sqlDatabase: Database = {
  findSkill,
  getChecklistItems,
  rebuild,
  recordChecklistCheck,
  saveGratitude,
  saveMood,
};

export default sqlDatabase;
