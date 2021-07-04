import React, { useState } from 'react';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { List, Text, Title } from 'react-native-paper';
import { useAppContext } from '../../AppContext';
import SkillBrowserResult from '../../models/SkillBrowserResult';
import SkillSearchResult from '../../models/SkillSearchResult';
import SkillDetail from '../SkillDetail/SkillDetail';

const SkillsBrowser = () => {
  const { db } = useAppContext();

  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);
  const [titles, setTitles] = useState<SkillBrowserResult[]>([]);
  const [skill, setSkill] = useState<SkillSearchResult | null>(null);

  useEffect(() => {
    updateTitles([]);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  async function updateTitles(thecrumbs: string[]) {
    const result = await db.getSkillsTitles(thecrumbs);
    console.log('updateTitles', result);

    if (result.success && result.data != null) {
      console.log('updateTitles', result.data);
      setTitles(result.data); // { list: result.data, keyPrefix: nowValue() }
    }
  }

  async function removeBreadcrumb() {
    const newBreadcrumbs = breadcrumbs.slice(0, breadcrumbs.length - 1);
    console.log('removeBreadcrumb', newBreadcrumbs);
    setBreadcrumbs(newBreadcrumbs);
    updateTitles(newBreadcrumbs);
  }

  async function addBreadcrumb(crumb: string) {
    const newBreadcrumbs = [...breadcrumbs, crumb];
    console.log('addBreadcrumb', newBreadcrumbs);
    setBreadcrumbs(newBreadcrumbs);
    updateTitles(newBreadcrumbs);
  }

  async function handleItemPress(res: SkillBrowserResult) {
    if (res.id < 0) {
      addBreadcrumb(res.label);
    } else {
      const skillRow = await db.getSkillById(res.id);
      setSkill(skillRow);
    }
  }

  return (
    <View>
      <Title>Skills browser</Title>
      <ScrollView>
        <View style={styles.breadcrumbs}>
          {breadcrumbs.map((b, i) => (
            <Text style={styles.crumb} key={i}>
              {i > 0 ? ' > ' : ' '}
              {b}
            </Text>
          ))}
        </View>
        {breadcrumbs.length > 0 && (
          <List.Item title=".." onPress={removeBreadcrumb} />
        )}
        {titles.map((t, i) => (
          <List.Item
            key={t.id < 0 ? i : t.id}
            title={t.label}
            onPress={() => handleItemPress(t)}
          />
        ))}
      </ScrollView>
      {skill && <SkillDetail skill={skill} onDismiss={() => setSkill(null)} />}
    </View>
  );
};

const styles = StyleSheet.create({
  breadcrumbs: {
    flexDirection: 'row',
  },
  crumb: {},
});

export default SkillsBrowser;
