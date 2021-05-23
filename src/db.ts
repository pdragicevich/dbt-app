import SQLite from 'react-native-sqlite-storage';
import SkillSearchResult from './models/SkillSearchResult';

async function withDb(callback: (_arg: SQLite.SQLiteDatabase) => void) {
  const db = await SQLite.openDatabase({ name: 'dbt.db', location: 'default' });
  callback(db);
}

const init = async () => {
  try {
    await withDb(db => {
      db.transaction(tx0 => {
        tx0.executeSql(
          `CREATE TABLE skills(
            skill_id INTEGER PRIMARY KEY AUTOINCREMENT,
            section VARCHAR(20),
            title VARCHAR(100),
            content TEXT)`,
          [],
          tx1 => {
            tx1.executeSql(
              `INSERT INTO skills ('section', 'title', 'content') VALUES
            ('DBT', 'TIPP', 'TIPP is temperature, intense exercise, paced stuff'),
            ('CBT', 'Check facts', 'omg'),
            ('Schema', 'Unrelenting standards', 'yeah')`,
              [],
            );
          },
          err => {
            throw err;
          },
        );
      });
    });
  } catch (err) {
    console.error(err);
  }
};

const findSkill = async (searchTerm: string) => {
  const result: SkillSearchResult[] = [];
  try {
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
  } catch (err) {
    console.error(err);
  }
  return result;
};

export default { init, findSkill };
