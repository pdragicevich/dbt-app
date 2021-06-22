import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import db from '../../db';
import SkillSearchResult from '../../models/SkillSearchResult';

const HomeScreen = () => {
  const [search, setSearch] = useState('');
  const [result, setResult] = useState<SkillSearchResult[]>([]);

  async function doSearch(str: string) {
    setSearch(str);
    const res = await db.findSkill(str);
    setResult(res);
  }

  return (
    <View>{result != null && result.length > 0 && <Text>Result!</Text>}</View>
  );
};

export default HomeScreen;
