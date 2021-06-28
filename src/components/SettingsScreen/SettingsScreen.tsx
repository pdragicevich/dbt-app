import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Title, Snackbar } from 'react-native-paper';
import { useDatabase } from '../../DbContext';

const SettingsScreen = () => {
  const db = useDatabase();

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

  function onDismissMessage() {
    setMessage('');
  }

  return (
    <View>
      <Title>Settings</Title>
      <Button icon="alert" mode="contained" onPress={initDb}>
        Re-initialise database
      </Button>
      <Snackbar visible={!!message} onDismiss={onDismissMessage}>
        {message}
      </Snackbar>
    </View>
  );
};

export default SettingsScreen;
