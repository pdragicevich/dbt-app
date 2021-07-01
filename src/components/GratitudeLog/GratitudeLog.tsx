import React, { useState } from 'react';
import { Title, Button, TextInput, Portal, Dialog } from 'react-native-paper';
import { useDatabase } from '../../DbContext';

const GratitudeLog = ({ onDismiss }: { onDismiss: (msg: string) => void }) => {
  const db = useDatabase();
  const [logLines, setLogLines] = useState<string[]>(['', '', '', '', '']);

  function setLogLine(index: number, value: string) {
    const newLogLines = [...logLines];
    newLogLines[index] = value;
    setLogLines(newLogLines);
  }

  async function saveGratitudeLog() {
    const result = await db.saveGratitude(logLines);
    if (result.success) {
      onDismiss('Thanks!');
    } else {
      onDismiss('There was a problem :(');
    }
  }

  return (
    <Portal>
      <Dialog visible={true} onDismiss={() => onDismiss('')}>
        <Dialog.Title>What are you grateful for?</Dialog.Title>
        <Dialog.Content>
          <Title>Gratitude log</Title>
          {logLines.map((v, i) => (
            <TextInput
              key={i}
              placeholder={'Entry ' + (i + 1)}
              value={v}
              onChangeText={text => setLogLine(i, text)}
            />
          ))}
          <Button mode="contained" onPress={saveGratitudeLog}>
            Save
          </Button>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

export default GratitudeLog;
