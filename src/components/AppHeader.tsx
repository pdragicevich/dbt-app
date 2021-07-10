import React, { useState } from 'react';
import { Appbar, Menu, Snackbar } from 'react-native-paper';
import TextLog from './TextLog/TextLog';
import OptionLog from './OptionLog/OptionLog';
import SkillSearch from './SkillSearch/SkillSearch';

//const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

const AppHeader = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [showOptionLogMenu, setShowOptionLogMenu] = useState(false);
  const [showTextLogMenu, setShowTextLogMenu] = useState(false);
  const [textLogId, setTextLogId] = useState(0);
  const [optionLogId, setOptionLogId] = useState(0);
  const [message, setMessage] = useState('');

  function onOptionLogDismiss(msg: string) {
    setMessage(msg);
    setOptionLogId(0);
    setShowTextLogMenu(false);
  }

  function onTextLogDismiss(msg: string) {
    setMessage(msg);
    setTextLogId(0);
    setShowTextLogMenu(false);
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Paul's Wellness App" />
        <Menu
          visible={showOptionLogMenu}
          onDismiss={() => setShowOptionLogMenu(false)}
          anchor={
            <Appbar.Action
              icon="emoticon-happy-outline"
              onPress={() => setShowOptionLogMenu(!showOptionLogMenu)}
            />
          }>
          <Menu.Item onPress={() => console.log('test')} title="Item 1" />
          <Menu.Item onPress={() => console.log('test')} title="Item 2" />
          <Menu.Item onPress={() => console.log('test')} title="Item 3" />
        </Menu>
        <Menu
          visible={showTextLogMenu}
          onDismiss={() => setShowTextLogMenu(false)}
          anchor={
            <Appbar.Action
              icon="text-box-outline"
              onPress={() => setShowTextLogMenu(true)}
            />
          }>
          <Menu.Item onPress={() => console.log('test')} title="Item 1" />
          <Menu.Item onPress={() => console.log('test')} title="Item 2" />
          <Menu.Item onPress={() => console.log('test')} title="Item 3" />
        </Menu>
        <Appbar.Action
          icon="magnify"
          onPress={() => setSearchVisible(!searchVisible)}
        />
      </Appbar.Header>
      {searchVisible && <SkillSearch onHide={() => setSearchVisible(false)} />}
      {optionLogId > 0 && (
        <OptionLog logId={optionLogId} onDismiss={onOptionLogDismiss} />
      )}
      {textLogId > 0 && (
        <TextLog logId={textLogId} onDismiss={onTextLogDismiss} />
      )}
      <Snackbar onDismiss={() => setMessage('')} visible={!!message}>
        {message}
      </Snackbar>
    </>
  );
};

export default AppHeader;
