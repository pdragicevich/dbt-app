import { SQLiteDatabase } from 'react-native-sqlite-storage';

const CreateTableVersionSQL = `CREATE TABLE IF NOT EXISTS Version(
  id INTEGER PRIMARY KEY NOT NULL,
  version INTEGER
);`;

const CreateSkillsTableSQL = `CREATE TABLE IF NOT EXISTS skills(
  id INTEGER PRIMARY KEY,
  file_id TEXT NOT NULL,
  area TEXT NOT NULL,
  section TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  contents TEXT);`;

const CreateTableChecklistSQL = `CREATE TABLE IF NOT EXISTS checklist(
  id INTEGER PRIMARY KEY,
  log_id INTEGER NOT NULL,
  position INTEGER NOT NULL,
  item TEXT NOT NULL);`;

const InitChecklistSQL = `INSERT INTO checklist (log_id,position,item)
  VALUES
     (1, 1, 'Sleep'),
     (1, 2, 'Hydration'),
     (1, 3, 'Morning meds'),
     (1, 4, 'Shower'),
     (1, 5, 'Sunlight'),
     (1, 6, 'Fruit'),
     (1, 7, 'Vegies'),
     (1, 8, 'Protein'),
     (1, 9, 'Exercise'),
     (1, 10, 'Fun/enjoyment'),
     (1, 11, 'Connecting'),
     (1, 12, 'Productivity'),
     (1, 13, 'Evening meds'),
     (1, 14, 'Multivitamin');`;

const CreateTableChecklistLogSQL = `CREATE TABLE IF NOT EXISTS checklist_log(
    id INTEGER PRIMARY KEY,
    checklist_id INTEGER,
    logged INTEGER NOT NULL);`;

const CreateTableLogDefinitionSQL = `CREATE TABLE IF NOT EXISTS log_def(
    id INTEGER PRIMARY KEY,
    type INTEGER NOT NULL,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    question TEXT NOT NULL,
    message TEXT,
    icon TEXT);`;

const CreateTableOptionLogSQL = `CREATE TABLE IF NOT EXISTS option_log(
    id INTEGER PRIMARY KEY,
    log_id INTEGER NOT NULL,
    logged INTEGER NOT NULL,
    value INTEGER NOT NULL);`;

const CreateTableOptionLogItemSQL = `CREATE TABLE IF NOT EXISTS option_log_item(
    id INTEGER PRIMARY KEY,
    log_id INTEGER NOT NULL,
    position INTEGER NOT NULL,
    label TEXT NOT NULL,
    value INTEGER NOT NULL,
    message TEXT NOT NULL,
    icon TEXT)`;

const CreateTableTextLogSQL = `CREATE TABLE IF NOT EXISTS text_log(
    id INTEGER PRIMARY KEY,
    log_id INTEGER NOT NULL,
    date INTEGER NOT NULL,
    text TEXT NOT NULL);`;

const CreateTableSettingsSQL = `CREATE TABLE IF NOT EXISTS settings(
    id INTEGER PRIMARY KEY,
    key TEXT NOT NULL,
    value TEXT NOT NULL);`;

const CreateTableAppLogSQL = `CREATE TABLE IF NOT EXISTS app_log(
    id INTEGER PRIMARY KEY,
    logged INTEGER NOT NULL,
    severity TEXT NOT NULL,
    message TEXT NOT NULL);`;

// (0, 'depression', 'Depression Symptoms', 'How is your depression?', 'emoticon-neutral-outline'),
// (0, 'anxiety', 'Anxiety Symptoms', 'How is your anxiety?', 'emoticon-neutral-outline'),

const InitLogDefSQL = `INSERT INTO log_def(id,type,name,title,question,message,icon)
   VALUES
    (1, 0, 'selfcare', 'Self Care', 'Self care checklist', NULL, NULL),
    (2, 1, 'mood', 'Mood Log', 'How are you feeling?', 'Thanks', 'emoticon-happy-outline'),
    (3, 1, 'anxiety', 'Anxiety Symptoms', 'How''s your anxiety?', 'Thanks', 'emoticon-happy-outline'),
    (4, 2, 'gratitude', 'Gratitude Log', 'What are you grateful for?', 'Thanks', 'human-handsup'),
    (5, 2, 'self-esteem-boost', 'Self Esteem', 'List some of your good qualities?', 'Thanks', 'human-handsup');`;

const InitOptionItemSQL = `INSERT INTO option_log_item(log_id,position,label,value,message,icon)
    VALUES
    (2, 1, 'Very happy', 5, 'So good!', 'emoticon-excited-outline'),
    (2, 2, 'Mildly happy', 4, 'Happy days!', 'emoticon-happy-outline'),
    (2, 3, 'Neutral', 3, 'Thanks!', 'emoticon-neutral-outline'),
    (2, 4, 'Not so good', 2, 'Sorry to hear that.', 'emoticon-sad-outline'),
    (2, 5, 'Unhappy', 1, 'Hope things pick up soon.', 'emoticon-frown-outline'),

    (3, 1, 'Chill', 5, 'So good!', 'emoticon-excited-outline'),
    (3, 2, 'Calm', 4, 'Happy days!', 'emoticon-happy-outline'),
    (3, 3, 'Neutral', 3, 'Thanks!', 'emoticon-neutral-outline'),
    (3, 4, 'Slightly anxious', 2, 'Sorry to hear that.', 'emoticon-sad-outline'),
    (3, 5, 'Very anxious', 1, 'Hope things pick up soon.', 'emoticon-frown-outline');`;

const TableSQL = [
  CreateTableVersionSQL,
  CreateTableSettingsSQL,
  CreateTableAppLogSQL,
  CreateSkillsTableSQL,
  CreateTableChecklistSQL,
  CreateTableChecklistLogSQL,
  CreateTableLogDefinitionSQL,
  CreateTableOptionLogSQL,
  CreateTableOptionLogItemSQL,
  CreateTableTextLogSQL,
];

import SQLite from 'react-native-sqlite-storage';
import { hasAny } from '../utils';

export class DbInit {
  // Perform any updates to the database schema. These can occur during initial configuration, or after an app store update.
  // This should be called each time the database is opened.
  public async updateDatabaseTables(database: SQLiteDatabase): Promise<void> {
    console.log('Beginning database updates...');

    // Get the database version.
    const dbVersion = await this.getDatabaseVersion(database);

    console.log('Current database version is: ' + dbVersion);

    // Perform DB updates based on this version
    // This is included as an example of how you make database schema changes once the app has been shipped
    if (dbVersion < 1) {
      // First: create tables if they do not already exist
      await database.transaction(this.createTables);

      // Uncomment the next line, and the referenced function below, to enable this
      await database.transaction(this.preVersion1Inserts);
    }
    //if (dbVersion < 2) {
    // Uncomment the next line, and the referenced function below, to enable this
    //await database.transaction(this.preVersion2Inserts);
    //}
    return;
  }

  // Perform initial setup of the database tables
  private createTables(tx: SQLite.Transaction) {
    // DANGER! For dev only
    /*
    const dropAllTables = false;
    if (dropAllTables) {

    }
    */

    for (const sql of TableSQL) {
      tx.executeSql(sql);
    }
  }

  // Get the version of the database, as specified in the Version table
  private async getDatabaseVersion(
    database: SQLite.SQLiteDatabase,
  ): Promise<number> {
    // Select the highest version number from the version table
    try {
      const results = await database.executeSql(
        'SELECT MAX(version) FROM Version;',
      );
      if (hasAny(results) && hasAny(results[0].rows)) {
        const version = results[0].rows.item(0).version;
        return version;
      } else {
        return 0;
      }
    } catch (error) {
      console.log(`No version set. Returning 0. Details: ${error}`);
      return 0;
    }
  }

  // Once the app has shipped, use the following functions as a template for updating the database:

  // This function should be called when the version of the db is < 1
  private preVersion1Inserts(transaction: SQLite.Transaction) {
    console.log('Running pre-version 1 DB inserts');
    // Make schema changes
    transaction.executeSql(InitChecklistSQL);
    transaction.executeSql(InitLogDefSQL);
    transaction.executeSql(InitOptionItemSQL);
    // Lastly, update the database version
    transaction.executeSql('INSERT INTO Version (version) VALUES (1);');
  }
  // This function should be called when the version of the db is < 2
  private preVersion2Inserts(transaction: SQLite.Transaction) {
    console.log('Running pre-version 2 DB inserts');

    // Make schema changes
    transaction.executeSql('ALTER TABLE ...');
    // Lastly, update the database version
    transaction.executeSql('INSERT INTO Version (version) VALUES (2);');
  }
}
