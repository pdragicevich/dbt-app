import React, { useState } from 'react';
import { View } from 'react-native';
import {
  Button,
  Title,
  Snackbar,
  Portal,
  Subheading,
} from 'react-native-paper';
import SkillsApi from '../../api/SkillsApi';
import { useAppContext } from '../../AppContext';
import backupDatabase from './Backup';

const SettingsScreen = () => {
  const { db, settings } = useAppContext();

  const [message, setMessage] = useState('');

  async function initDb() {
    let success = false;
    try {
      const result = await db.rebuild();
      success = result.success;
      if (!result.success) {
        console.error('initDb', result);
      }
    } catch (ex) {
      console.error('initDb', ex);
    }
    if (success) {
      setMessage('Rebuilt OK!');
    } else {
      setMessage('There was a problem doing that!');
    }
  }

  async function reloadSkills() {
    let success = false;
    const skills = await SkillsApi.getSkillsSummary(settings);
    if (skills.success && skills.data != null) {
      const dbResult = await db.saveSkills(skills.data);
      if (dbResult.success) {
        success = true;
      }
    }
    if (success) {
      setMessage('Reloaded skills OK!');
    } else {
      setMessage('There was a problem doing that.');
    }
  }

  function onDismissMessage() {
    setMessage('');
  }

  async function backup() {
    try {
      await backupDatabase();
      setMessage('Backed up successfully!');
    } catch (ex) {
      db.insertAppLog('error', `SettingsScreen backup ${ex}`);
      console.error('SettingsScreen backup ERROR', ex);
      setMessage('Sorry, there was a problem doing that');
    }
  }

  return (
    <View>
      <Title>Settings</Title>

      <Subheading>Backup</Subheading>
      <Button icon="database" mode="contained" onPress={backup}>
        Backup
      </Button>

      <Subheading>Dangerous operations</Subheading>
      <Button icon="alert" mode="contained" onPress={initDb}>
        Re-initialise database
      </Button>
      <Button icon="alert" mode="contained" onPress={reloadSkills}>
        Reload skills
      </Button>

      <Portal>
        <Snackbar
          visible={!!message}
          onDismiss={onDismissMessage}
          duration={settings.snackbarDurationMs}
          action={{
            label: 'Ok',
            onPress: onDismissMessage,
          }}>
          {message}
        </Snackbar>
      </Portal>
    </View>
  );
};

export default SettingsScreen;
