import React, { useState } from 'react';
import { Appbar, Snackbar } from 'react-native-paper';
import MoodLog from './MoodLog/MoodLog';
import SkillSearch from './SkillSearch/SkillSearch';

//const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

const AppHeader = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [showMoodLog, setShowMoodLog] = useState(false);
  const [message, setMessage] = useState('');

  function onMoodLogDismiss(msg: string) {
    setMessage(msg);
    setShowMoodLog(false);
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Paul's Wellness App" />
        <Appbar.Action
          icon="emoticon-happy-outline"
          onPress={() => setShowMoodLog(!showMoodLog)}
        />
        <Appbar.Action
          icon="magnify"
          onPress={() => setSearchVisible(!searchVisible)}
        />
      </Appbar.Header>
      {searchVisible && <SkillSearch onHide={() => setSearchVisible(false)} />}
      {showMoodLog && <MoodLog onDismiss={onMoodLogDismiss} />}
      <Snackbar onDismiss={() => setMessage('')} visible={!!message}>
        {message}
      </Snackbar>
    </>
  );
};

export default AppHeader;
