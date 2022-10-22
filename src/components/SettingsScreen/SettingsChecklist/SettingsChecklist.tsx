import { useAppContext } from '../../../AppContext';
import ChecklistItem, {
  checklistItemSort,
} from '../../../models/ChecklistItem';
import LogDef from '../../../models/LogDef';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text, TextInput, Title } from 'react-native-paper';

const SettingsChecklist = ({ logId }: { logId: number }) => {
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
    console.log(result);
    setItems(result.sort(checklistItemSort));
  }

  function setChecklistItem(index: number, text: string) {
    setItems(prevItems => {
      const nextItems = [...prevItems];
      nextItems[index].item = text;
      return nextItems;
    });
  }

  return (
    <View>
      <Title>Editing {logDef?.title ?? 'checklist'}</Title>
      <View>
        <Text>Number of items: {items?.length ?? 0}</Text>
      </View>
      {items?.map((item, index) => (
        <View key={item.id}>
          <TextInput
            value={item.item}
            onChangeText={text => setChecklistItem(index, text)}
            autoComplete="off"
          />
        </View>
      ))}
    </View>
  );
};

export default SettingsChecklist;
