import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';

const Settings = () => {
  function initDb() {
    console.log('initDb!');
  }

  return (
    <View>
      <Text>Settings</Text>
      <Button icon="alert" mode="contained" onPress={initDb}>
        Re-initialise database
      </Button>
    </View>
  );
};

export default Settings;
