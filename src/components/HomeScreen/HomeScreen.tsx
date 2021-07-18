import React from 'react';
import { View } from 'react-native';
import Log from '../../const/Log';
import Checklist from '../Checklist/Checklist';

const HomeScreen = () => {
  return (
    <View>
      <Checklist logId={Log.Wellness} />
    </View>
  );
};

export default HomeScreen;
