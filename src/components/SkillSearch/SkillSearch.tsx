import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Portal, Searchbar } from 'react-native-paper';
import { useDatabase } from '../../DbContext';
import SkillSearchResult from '../../models/SkillSearchResult';
import { guardedTrim, hasAny } from '../../utils';
import _debounce from 'lodash.debounce';

const SkillSearch = ({ onHide }: { onHide: () => void }) => {
  const db = useDatabase();

  const [search, setSearch] = useState('');
  const [result, setResult] = useState<SkillSearchResult[]>([]);

  function doSearch(str: string) {
    const trimmed = guardedTrim(str);
    if (trimmed.length < 1) {
      onHide();
    }
    setSearch(str);
    findSkill(str);
  }

  const findSkill = _debounce(str => {
    db.findSkill(str)
      .then(setResult)
      .catch(() => setResult([]));
  }, 500);

  return (
    <Portal>
      <Searchbar
        style={styles.searchbar}
        placeholder="Find a skill"
        onChangeText={doSearch}
        value={search}
      />
      {hasAny(result) && result.map(r => <Text>{r.title}</Text>)}
    </Portal>
  );
};

const styles = StyleSheet.create({
  searchbar: {
    top: 20,
  },
});

export default SkillSearch;
