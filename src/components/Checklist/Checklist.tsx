import React, { useState } from 'react';
import { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { Checkbox, Title } from 'react-native-paper';
import { useAppContext } from '../../AppContext';
import ChecklistItem, { checklistItemSort } from '../../models/ChecklistItem';
import LogDef from '../../models/LogDef';

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

export default Checklist;
