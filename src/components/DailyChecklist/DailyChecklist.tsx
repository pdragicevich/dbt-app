import React, { useState } from 'react';
import { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { Checkbox, Title } from 'react-native-paper';
import { useDatabase } from '../../DbContext';
import ChecklistItem from '../../models/ChecklistItem';

function checklistSort(a: ChecklistItem, b: ChecklistItem) {
  if (a.checked && !b.checked) {
    return 1;
  }
  if (!a.checked && b.checked) {
    return -1;
  }
  if (a.id > b.id) {
    return 1;
  }
  if (a.id < b.id) {
    return -1;
  }
  return 0;
}

const DailyChecklist = () => {
  const db = useDatabase();

  const [items, setItems] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    getChecklistItems();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  async function getChecklistItems() {
    const result = await db.getChecklistItems();
    setItems(result.sort(checklistSort));
  }

  async function setChecked(index: number) {
    try {
      const id = items[index].id;
      const oldChecked = items[index].checked;
      const newChecked = !oldChecked;
      await db.recordChecklistCheck(id, newChecked);
      const newItems = [...items];
      newItems[index].checked = newChecked;

      setItems(newItems.sort(checklistSort));
    } catch (ex) {
      await getChecklistItems();
    }
  }

  return (
    <View>
      <Title>Daily checklist</Title>
      <ScrollView>
        {items.map((x, i) => (
          <Checkbox.Item
            key={x.id}
            label={x.item}
            onPress={() => setChecked(i)}
            status={x.checked ? 'checked' : 'unchecked'}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default DailyChecklist;
