import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Title, Snackbar } from 'react-native-paper';
import db from '../../db';

const SettingsScreen = () => {
  const [message, setMessage] = useState('');

  async function initDb() {
    try {
      await db.rebuild();
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
