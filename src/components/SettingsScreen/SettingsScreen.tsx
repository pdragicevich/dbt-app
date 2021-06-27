import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Title, Snackbar } from 'react-native-paper';
import { useDatabase } from '../../DbContext';

const SettingsScreen = () => {
  const db = useDatabase();

  const [message, setMessage] = useState('');

  async function initDb() {
    try {
      const result = await db.rebuild();
      console.log(result);
      setMessage('Rebuilt OK!');
    } catch (ex) {
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
