import React from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView, View } from 'react-native';
import AppMessage from './AppMessage';

interface ScreenLayoutProps {
  appMessage: string;
}

const ScreenLayout: React.FunctionComponent<ScreenLayoutProps> = ({
  appMessage,
  children,
}) => (
  <View style={styles.view}>
    <ScrollView>{children}</ScrollView>
    <AppMessage message={appMessage} />
  </View>
);

const styles = StyleSheet.create({
  view: {
    height: '100%',
    width: '100%',
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
});

export default ScreenLayout;
