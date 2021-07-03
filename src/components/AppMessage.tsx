import React from 'react';
import { Text } from 'react-native-paper';

const AppMessage = ({ message }: { message: string }) => {
  return <Text>{message}</Text>;
};

export default AppMessage;
