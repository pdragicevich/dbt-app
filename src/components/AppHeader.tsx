import React, { useState } from 'react';
import { Appbar, Searchbar, Text } from 'react-native-paper';
import SkillSearchResult from '../models/SkillSearchResult';
import { hasAny } from '../utils';
import { useDatabase } from '../DbContext';

//const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

const AppHeader = () => {
  const db = useDatabase();

  const [search, setSearch] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const [result, setResult] = useState<SkillSearchResult[]>([]);

  async function doSearch(str: string) {
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
        <Appbar.Content title={searchVisible ? '' : "Paul's Wellness App"} />
        <Appbar.Action
          icon="magnify"
          onPress={() => setSearchVisible(!searchVisible)}
        />
      </Appbar.Header>
      {searchVisible && (
        <Searchbar
          placeholder="Find a skill"
          onChangeText={doSearch}
          value={search}
        />
      )}
      {hasAny(result) && result.map(r => <Text>{r.title}</Text>)}
    </>
  );
};

export default AppHeader;
