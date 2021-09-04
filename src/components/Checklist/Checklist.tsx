import ChecklistItem, { checklistItemSort } from '../../models/ChecklistItem';
import LogDef from '../../models/LogDef';
import React, { useState } from 'react';
import { Checkbox, Title } from 'react-native-paper';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppContext } from '../../AppContext';
import { useEffect } from 'react';

const Checklist = ({ logId }: { logId: number }) => {
  const { db } = useAppContext();

  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [logDef, setLogDef] = useState<LogDef | null>(null);

  useEffect(() => {
    async function initChecklist() {
      const result = await db.readLogDef(logId);
      setLogDef(result);
      await getChecklistItems();
    }
    initChecklist();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  async function getChecklistItems() {
    const result = await db.getChecklistItems(logId);
    setItems(result.sort(checklistItemSort));
  }

  async function setChecked(index: number) {
    try {
      const id = items[index].id;
      const oldChecked = items[index].checked;
      const newChecked = !oldChecked;
      await db.recordChecklistCheck(id, newChecked);
      const newItems = [...items];
      newItems[index].checked = newChecked;

      setItems(newItems.sort(checklistItemSort));
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
