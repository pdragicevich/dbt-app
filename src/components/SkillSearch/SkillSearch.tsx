import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dialog, List, Portal, Searchbar, Text } from 'react-native-paper';
import { useAppContext } from '../../AppContext';
import SkillSearchResult from '../../models/SkillSearchResult';
import { guardedTrim, hasAny } from '../../utils';
import _debounce from 'lodash.debounce';

const SkillSearch = ({ onHide }: { onHide: () => void }) => {
  const { db } = useAppContext();

  const [search, setSearch] = useState('');
  const [result, setResult] = useState<SkillSearchResult[]>([]);
  const [skill, setSkill] = useState<SkillSearchResult | null>(null);

  function doSearch(str: string) {
    const trimmed = guardedTrim(str);
    if (trimmed.length < 1) {
      onHide();
    } else {
      setSearch(str);
      findSkill(str);
    }
  }

  const findSkill = _debounce(str => {
    db.findSkill(str)
      .then(res => {
        console.log(res);
        setResult(res);
      })
      .catch(() => setResult([]));
  }, 500);

  return (
    <Portal>
      <View>
        <Searchbar
          style={styles.searchbar}
          placeholder="Find a skill"
          onChangeText={doSearch}
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
      {skill && (
        <Dialog visible={true} onDismiss={() => setSkill(null)}>
          <Dialog.Title>{skill.title}</Dialog.Title>
          <Dialog.Content>
            <Text>{skill.summary}</Text>
          </Dialog.Content>
        </Dialog>
      )}
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
