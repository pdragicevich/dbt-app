import React, { useState } from 'react';
import { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { Checkbox, Title } from 'react-native-paper';
import { useAppContext } from '../../AppContext';
import Log from '../../const/Log';
import ChecklistItem, { checklistItemSort } from '../../models/ChecklistItem';

const DailyChecklist = () => {
  const { db } = useAppContext();

  const [items, setItems] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    getChecklistItems();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  async function getChecklistItems() {
    const result = await db.getChecklistItems(Log.Wellness);
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
