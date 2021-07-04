import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

const LoadingScreen = ({ progressMessage }: { progressMessage: string }) => (
  <View style={styles.view}>
    <Text>Loading Paul's Wellness App</Text>
    <ActivityIndicator size="large" animating={true} />
    <Text>{progressMessage}</Text>
  </View>
);

const styles = StyleSheet.create({
  view: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});

export default LoadingScreen;
