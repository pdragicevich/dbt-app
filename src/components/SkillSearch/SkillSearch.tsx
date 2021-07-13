import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { List, Portal, Searchbar } from 'react-native-paper';
import { useAppContext } from '../../AppContext';
import SkillSearchResult from '../../models/SkillSearchResult';
import { guardedTrim, hasAny } from '../../utils';
import _debounce from 'lodash.debounce';
import SkillDetail from '../SkillDetail/SkillDetail';
import { useEffect } from 'react';

const SkillSearch = ({ onHide }: { onHide: () => void }) => {
  const { db } = useAppContext();

  const [search, setSearch] = useState('');
  const [result, setResult] = useState<SkillSearchResult[]>([]);
  const [skill, setSkill] = useState<SkillSearchResult | null>(null);

  useEffect(() => {
    const findSkill = _debounce(str => {
      if (str.length < 1) {
        setResult([]);
      } else {
        db.findSkill(str)
          .then(res => {
            setResult(res);
          })
          .catch(() => setResult([]));
      }
    }, 500);
    findSkill(search);
  }, [db, search]);

  function doSearch(str: string) {
    setSearch(guardedTrim(str));
  }

  return (
    <Portal>
      <View>
        <Searchbar
          style={styles.searchbar}
          placeholder="Find a skill"
          onChangeText={doSearch}
          onIconPress={() => onHide()}
          value={search}
        />
        {hasAny(result) && (
          <View style={styles.results}>
            {result.map(r => (
              <List.Item
                key={r.id}
                title={r.title}
                onPress={() => setSkill(r)}
              />
            ))}
          </View>
        )}
      </View>
      {skill && <SkillDetail skill={skill} onDismiss={() => setSkill(null)} />}
    </Portal>
  );
};

const styles = StyleSheet.create({
  results: {
    backgroundColor: 'white',
    top: 20,
  },
  searchbar: {
    top: 20,
  },
});

export default SkillSearch;
