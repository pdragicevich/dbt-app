import SQLite from 'react-native-sqlite-storage';
import Result from './models/Result';
import SkillSearchResult from './models/SkillSearchResult';

async function withDb(callback: (_arg: SQLite.SQLiteDatabase) => void) {
  const db = await SQLite.openDatabase({ name: 'dbt.db', location: 'default' });
  callback(db);
}

const CreateSkillsTableSQL = `CREATE TABLE IF NOT EXISTS skills(
  id INTEGER PRIMARY KEY,
  section TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL)`;

const CreateTableChecklistSQL = `CREATE TABLE IF NOT EXISTS checklist(
  id INTEGER PRIMARY KEY,
  item TEXT NOT NULL)`;

const CreateTableChecklistLogSQL = `CREATE TABLE IF NOT EXISTS checklist_log(
  id INTEGER PRIMARY KEY,
  checklist_id INTEGER,
  logged INTEGER NOT NULL)`;

const CreateTableMoodLogSQL = `CREATE TABLE IF NOT EXISTS mood_log(
  id INTEGER PRIMARY KEY,
  mood INTEGER NOT NULL)`;

const init: () => Promise<Result> = async () => {
  try {
    await execInitScript(CreateSkillsTableSQL);
    await execInitScript(CreateTableChecklistSQL);
    await execInitScript(CreateTableChecklistLogSQL);
    await execInitScript(CreateTableMoodLogSQL);
    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
};

const execInitScript = async (sql1: string, sql2?: string) => {
  await withDb(db => {
    db.transaction(tx0 => {
      tx0.executeSql(
        sql1,
        [],
        tx1 => {
          if (sql2 != null) {
            tx1.executeSql(sql2, []);
          }
        },
        err => {
          throw err;
        },
      );
    });
  });
};

const rebuild: () => Promise<Result> = async () => {
  try {
    await SQLite.deleteDatabase({ name: 'dbt.db', location: 'default' });
    await init();
  } catch (ex) {
    return { success: false, error: ex };
  }
  return { success: true };
};

const findSkill = async (searchTerm: string) => {
  const result: SkillSearchResult[] = [];
  await withDb(db => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM skills WHERE title LIKE ?',
        [`%${searchTerm}%`],
        (tx1, res) => {
          console.log(res);
          for (let i = 0; i < res.rows.length; i++) {
            result.push(res.rows.item(i));
          }
        },
      );
    });
  });
  return result;
};

export default { init, findSkill, rebuild };
