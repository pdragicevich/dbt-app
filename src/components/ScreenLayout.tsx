import React from 'react';
import { ScrollView, View } from 'react-native';
import AppMessage from './AppMessage';

interface ScreenLayoutProps {
  appMessage: string;
}

const ScreenLayout: React.FunctionComponent<ScreenLayoutProps> = ({
  appMessage,
  children,
}) => (
  <View>
    <ScrollView>{children}</ScrollView>
    <AppMessage message={appMessage} />
  </View>
);

export default ScreenLayout;
