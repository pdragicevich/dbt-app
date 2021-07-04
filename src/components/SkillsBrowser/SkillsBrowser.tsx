import React, { useState } from 'react';
import { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { List, Title } from 'react-native-paper';
import { useAppContext } from '../../AppContext';

const SkillsBrowser = () => {
  const { db } = useAppContext();

  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);
  const [titles, setTitles] = useState<string[]>([]);

  useEffect(() => {
    updateTitles();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [breadcrumbs]);

  async function updateTitles() {
    const result = await db.getSkillsTitles(breadcrumbs);
    console.log('updateTitles', result);

    if (result.success && result.data != null) {
      setTitles(result.data);
    }
  }

  async function removeBreadcrumb() {
    const newBreadcrumbs = breadcrumbs.slice(0, breadcrumbs.length - 1);
    console.log('removeBreadcrumb', newBreadcrumbs);
    setBreadcrumbs(newBreadcrumbs);
  }

  async function addBreadcrumb(crumb: string) {
    const newBreadcrumbs = [...breadcrumbs, crumb];
    console.log('addBreadcrumb', newBreadcrumbs);
    setBreadcrumbs(newBreadcrumbs);
  }

  return (
    <View>
      <Title>Skills browser</Title>
      <ScrollView>
        {breadcrumbs.length > 0 && (
          <List.Item title=".." onPress={removeBreadcrumb} />
        )}
        {titles.map((t, i) => (
          <List.Item key={i} title={t} onPress={() => addBreadcrumb(t)} />
        ))}
      </ScrollView>
    </View>
  );
};

export default SkillsBrowser;
