import { AppState, AppStateStatus } from 'react-native';
import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';
import AppSettings, { defaultSettings } from '../AppSettings/AppSettings';
import ChecklistItem from '../models/ChecklistItem';
import LogDef from '../models/LogDef';
import LogItem from '../models/LogItem';
import { dataResult, result } from '../models/Result';
import Skill from '../models/Skill';
import SkillBrowserResult from '../models/SkillBrowserResult';
import SkillSearchResult from '../models/SkillSearchResult';
import {
  firstOrDefault,
  guardedTrim,
  hasAny,
  unixDateNow,
  unixDateToday,
} from '../utils';
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

/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
function noResults(results: any) {
  return !hasAny(results) || !hasAny(results[0].rows);
}

const findSkill = (searchTerm: string) =>
  select<SkillSearchResult>('SELECT * FROM skills WHERE UPPER(title) LIKE ?', [
    `%${guardedTrim(searchTerm).toUpperCase()}%`,
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

  if (noResults(results)) {
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

const saveOptionLog = async (logId: number, value: number) => {
  try {
    const db = await getDatabase();
    const now = unixDateNow();

    await db.executeSql(
      'INSERT INTO option_log(log_id,logged,value) VALUES (?,?,?)',
      [logId, now, value],
    );
    return result(true);
  } catch (ex) {
    return result(false, ex);
  }
};

const saveTextLog = async (logId: number, lines: string[]) => {
  try {
    const db = await getDatabase();
    const now = unixDateNow();

    await db.transaction(tx => {
      for (const line of lines) {
        const trimmed = guardedTrim(line);
        if (trimmed.length > 0) {
          tx.executeSql(
            'INSERT INTO text_log(log_id, date, text) VALUES (?, ?, ?)',
            [logId, now, trimmed],
          );
        }
      }
    });

    return result(true);
  } catch (ex) {
    return result(false, ex);
  }
};

const saveSkills = async (skills: Skill[]) => {
  try {
    const db = await getDatabase();

    await db.transaction(tx => {
      tx.executeSql('DELETE FROM skills');
      for (const skill of skills) {
        tx.executeSql(
          'INSERT INTO skills(file_id,area,section,title,summary) VALUES (?,?,?,?,?)',
          [skill.id, skill.area, skill.section, skill.title, skill.summary],
        );
      }
    });

    return result(true);
  } catch (ex) {
    return result(false, ex);
  }
};

interface SettingsRow {
  key: string;
  value: string;
}

const readSettings = async () => {
  try {
    const settings: AppSettings = { ...defaultSettings };
    const db = await getDatabase();
    const results = await db.executeSql('SELECT key, value FROM settings');

    if (noResults(results)) {
      return dataResult<AppSettings>(true, settings);
    }

    const rows = results[0].rows;

    for (let i = 0; i < rows.length; i++) {
      const row = rows.item(i) as SettingsRow;

      switch (row.key) {
        case 'logBatch':
          settings.logBatch = parseInt(row.value, 10);
          break;

        case 'skillsApiUrl':
          settings.skillsApiUrl = guardedTrim(row.value);
          break;
      }
    }

    return dataResult<AppSettings>(true, settings);
  } catch (ex) {
    return dataResult<AppSettings>(false, null, ex);
  }
};

const getSkillsCount = async () => {
  try {
    const db = await getDatabase();
    const results = await db.executeSql(
      'SELECT COUNT(id) skillsCount FROM skills',
    );
    if (noResults(results)) {
      return 0;
    }
    return parseInt(results[0].rows.item(0).skillsCount, 10);
  } catch (ex) {
    return 0;
  }
};

const getSkillsTitles = async (breadcrumbs: string[]) => {
  try {
    const titles: SkillBrowserResult[] = [];
    const db = await getDatabase();

    let results: SQLite.ResultSet[] = [];
    switch (breadcrumbs.length) {
      case 0:
        results = await db.executeSql(
          'SELECT DISTINCT(area) breadcrumb FROM skills ORDER BY area',
        );
        break;

      case 1:
        results = await db.executeSql(
          'SELECT DISTINCT(section) breadcrumb FROM skills WHERE area = ? ORDER BY section',
          breadcrumbs,
        );
        break;

      case 2:
        results = await db.executeSql(
          'SELECT id, title breadcrumb FROM skills WHERE area = ? AND section = ? ORDER BY title',
          breadcrumbs,
        );
        break;

      default:
        return dataResult<SkillBrowserResult[]>(
          false,
          titles,
          'Invalid breadcrumbs',
        );
    }

    if (noResults(results)) {
      return dataResult<SkillBrowserResult[]>(false, titles, 'No results');
    }

    const rows = results[0].rows;
    for (let i = 0; i < rows.length; i++) {
      titles.push({
        id: rows.item(i).id || -1,
        label: rows.item(i).breadcrumb,
      });
    }

    return dataResult<SkillBrowserResult[]>(true, titles);
  } catch (ex) {
    return dataResult<SkillBrowserResult[]>(false, null, ex);
  }
};

const getSkillById = async (id: number) => {
  const rows = await select<SkillSearchResult>(
    'SELECT * FROM skills WHERE id = ?',
    [id],
  );
  return firstOrDefault<SkillSearchResult>(rows);
};

const updateSkillContent = async (id: number, content: string) => {
  try {
    const db = await getDatabase();
    await db.executeSql('UPDATE skills SET contents = ? WHERE id = ?', [
      content,
      id,
    ]);
    return result(true);
  } catch (ex) {
    return result(false, ex);
  }
};

const readLogDef = async (id: number) => {
  const rows = await select<LogDef>('SELECT * FROM log_def WHERE id = ?', [id]);
  return firstOrDefault<LogDef>(rows);
};

const getOptionLogItems = (logId: number) =>
  select<LogItem>('SELECT * FROM option_log_item WHERE log_id = ?', [logId]);

const readLogDefs = async () =>
  select<LogDef>('SELECT * FROM log_def ORDER BY id');

const sqlDatabase: Database = {
  findSkill,
  getChecklistItems,
  getOptionLogItems,
  getSkillById,
  getSkillsCount,
  getSkillsTitles,
  readLogDef,
  readLogDefs,
  readSettings,
  rebuild,
  recordChecklistCheck,
  saveOptionLog,
  saveSkills,
  saveTextLog,
  updateSkillContent,
};

export default sqlDatabase;
