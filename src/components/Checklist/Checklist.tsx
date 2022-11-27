import { useAppContext } from '../../AppContext';
import StatsDefId from '../../const/StatsDefId';
import ChecklistItem, { checklistItemSort } from '../../models/ChecklistItem';
import LogDef from '../../models/LogDef';
import { roundTo, unixDateToday } from '../../utils';
import { TabParamList } from '../App';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Checkbox, Title } from 'react-native-paper';

const Checklist = ({ logId }: { logId: number }) => {
  const { db } = useAppContext();
  const navigation =
    useNavigation<MaterialBottomTabNavigationProp<TabParamList, 'Home'>>();

  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [logDef, setLogDef] = useState<LogDef | null>(null);

  const getChecklistItems = useCallback(
    async function getChecklistItems() {
      const result = await db.getChecklistItems(logId);
      setItems(result.sort(checklistItemSort));
    },
    [db, logId],
  );

  useEffect(() => {
    async function initChecklist() {
      const result = await db.readLogDef(logId);
      setLogDef(result);
      await getChecklistItems();
    }
    initChecklist();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', () => {
      getChecklistItems();
    });

    return unsubscribe;
  }, [navigation, getChecklistItems]);

  async function setChecked(index: number) {
    try {
      const id = items[index].id;
      const oldChecked = items[index].checked;
      const newChecked = !oldChecked;
      await db.recordChecklistCheck(id, items.length, newChecked);
      const newItems = [...items];
      newItems[index].checked = newChecked;

      setItems(newItems.sort(checklistItemSort));

      const numberChecked = newItems.reduce(
        (nChecked, item) => (item.checked ? nChecked + 1 : nChecked),
        0,
      );

      const statsValue = roundTo((numberChecked * 100) / newItems.length, 2);
      console.log('statsValue', statsValue);

      await db.setStatsLog(StatsDefId.Checklist, unixDateToday(), statsValue);
    } catch (ex) {
      await getChecklistItems();
    }
  }

  return (
    <View>
      <Title>{logDef?.title ?? 'Daily checklist'}</Title>
      <ScrollView style={styles.scrollView}>
        {items.map((x, i) => (
          <View key={x.id} style={styles.item}>
            <View style={styles.checkbox}>
              <Checkbox
                key={x.id}
                onPress={() => setChecked(i)}
                status={x.checked ? 'checked' : 'unchecked'}
              />
            </View>
            <Text>{x.item}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    marginTop: 10,
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 42,
  },
  checkbox: {
    marginRight: 4,
  },
});

export default Checklist;
