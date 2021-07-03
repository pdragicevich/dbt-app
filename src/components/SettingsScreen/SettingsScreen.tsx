import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Title, Snackbar, Portal } from 'react-native-paper';
import SkillsApi from '../../api/SkillsApi';
import { useAppContext } from '../../AppContext';

const SettingsScreen = () => {
  const { db } = useAppContext();

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
    const skills = await SkillsApi.getSkillsSummary();
    if (skills.success && skills.data != null) {
      const dbResult = await db.saveSkills(skills.data);
      if (dbResult.success) {
        success = true;
      }
    }
    if (success) {
      setMessage('Reloaded skills OK!');
    } else {
      setMessage('There was a problem doing that!');
    }
  }

  function onDismissMessage() {
    setMessage('');
  }

  return (
    <View>
      <Title>Settings</Title>
      <Button icon="alert" mode="contained" onPress={initDb}>
        Re-initialise database
      </Button>
      <Button icon="alert" mode="contained" onPress={reloadSkills}>
        Reload skills
      </Button>
      <Portal>
        <Snackbar visible={!!message} onDismiss={onDismissMessage}>
          {message}
        </Snackbar>
      </Portal>
    </View>
  );
};

export default SettingsScreen;
