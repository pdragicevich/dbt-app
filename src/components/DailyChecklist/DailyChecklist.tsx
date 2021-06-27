import React, { useState } from 'react';
import { useEffect } from 'react';
import { View } from 'react-native';
import { Checkbox, Title } from 'react-native-paper';
import { useDatabase } from '../../DbContext';

interface ItemChecked {
  id: number;
  item: string;
  checked: boolean;
}

const DailyChecklist = () => {
  const db = useDatabase();

  const [items, setItems] = useState<ItemChecked[]>([]);

  useEffect(() => {
    getChecklistItems();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  async function getChecklistItems() {
    const result = await db.getChecklistItems();
    const newItems = result.map(x => {
      return { ...x, checked: false };
    });
    setItems(newItems);
  }

  function setChecked(index: number) {
    const newItems = [...items];
    newItems[index].checked = !newItems[index].checked;
    setItems(newItems);
  }

  return (
    <View>
      <Title>Daily checklist</Title>
      {items.map((x, i) => (
        <Checkbox.Item
          key={x.id}
          label={x.item}
          onPress={() => setChecked(i)}
          status={x.checked ? 'checked' : 'unchecked'}
        />
      ))}
    </View>
  );
};

export default DailyChecklist;
