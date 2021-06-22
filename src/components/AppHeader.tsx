import React, { useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Appbar, TextInput } from 'react-native-paper';

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

const AppHeader = () => {
  const [searchVisible, setSearchVisible] = useState(false);

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title={searchVisible ? '' : "Paul's Wellness Log"} />
        {searchVisible && (
          <TextInput style={styles.search} label="Find a skill" />
        )}
        <Appbar.Action
          icon="magnify"
          onPress={() => setSearchVisible(!searchVisible)}
        />
        <Appbar.Action icon={MORE_ICON} onPress={() => {}} />
      </Appbar.Header>
    </>
  );
};

const styles = StyleSheet.create({
  search: {
    height: 20,
    width: 200,
  },
});

export default AppHeader;
