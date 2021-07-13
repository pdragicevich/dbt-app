import React from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView, View } from 'react-native';

const ScreenLayout: React.FC = ({ children }) => (
  <View style={styles.view}>
    <ScrollView>{children}</ScrollView>
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
