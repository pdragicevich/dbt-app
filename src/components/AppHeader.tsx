import React, { useState } from 'react';
import { Appbar, Portal, Searchbar, Text } from 'react-native-paper';
import SkillSearchResult from '../models/SkillSearchResult';
import { guardedTrim, hasAny } from '../utils';
import { useDatabase } from '../DbContext';
import { StyleSheet } from 'react-native';

//const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

const AppHeader = () => {
  const db = useDatabase();

  const [search, setSearch] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const [result, setResult] = useState<SkillSearchResult[]>([]);

  async function doSearch(str: string) {
    const trimmed = guardedTrim(str);
    if (trimmed.length < 1) {
      setSearchVisible(false);
    }
    setSearch(str);
    try {
      const res = await db.findSkill(str);
      setResult(res);
    } catch (ex) {
      setResult([]);
    }
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Paul's Wellness App" />
        <Appbar.Action
          icon="magnify"
          onPress={() => setSearchVisible(!searchVisible)}
        />
      </Appbar.Header>
      {searchVisible && (
        <Portal>
          <Searchbar
            style={styles.searchbar}
            placeholder="Find a skill"
            onChangeText={doSearch}
            value={search}
          />
          {hasAny(result) && result.map(r => <Text>{r.title}</Text>)}
        </Portal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  searchbar: {
    top: 20,
  },
});

export default AppHeader;
