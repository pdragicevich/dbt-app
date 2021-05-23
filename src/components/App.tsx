/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { BottomNavigation, Title, TextInput } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import db from '../db';
import SkillSearchResult from '../models/SkillSearchResult';

const MusicRoute = () => (
  <WebView source={{ html: '<h1>Skills</h1><p>Here I am</p>' }} />
);

const AlbumsRoute = () => <Text>Albums</Text>;

const RecentsRoute = () => <Text>Recents</Text>;

const App = () => {
  const [search, setSearch] = useState('');
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'music', title: 'Skills', icon: 'bookshelf' },
    { key: 'albums', title: 'Reports', icon: 'chart-areaspline-variant' },
    { key: 'recents', title: 'Settings', icon: 'cog-outline' },
  ]);
  const [result, setResult] = useState<SkillSearchResult[]>([]);

  const renderScene = BottomNavigation.SceneMap({
    music: MusicRoute,
    albums: AlbumsRoute,
    recents: RecentsRoute,
  });

  useEffect(() => {
    db.init();
  });

  async function doSearch(str: string) {
    setSearch(str);
    const res = await db.findSkill(str);
    console.log(res);
    setResult(res);
  }

  return (
    <>
      <View>
        <Title>DBT thang</Title>
        <TextInput
          label="Find a skill"
          value={search}
          onChangeText={text => doSearch(text)}
        />
        {result != null && result.length > 0 && <Text>Result!</Text>}
      </View>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </>
  );
};

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

export default App;
