import Log from '../../const/Log';
import Checklist from '../Checklist/Checklist';
import React from 'react';
import { View } from 'react-native';

const HomeScreen = () => {
  return (
    <View>
      <Checklist logId={Log.Wellness} />
    </View>
  );
};

export default HomeScreen;
