import React, { useRef, useState } from 'react';
import { Title, Button, TextInput, Portal, Dialog } from 'react-native-paper';
import { useDatabase, useSettings } from '../../AppContext';

const LogLine = ({
  placeholder,
  initialValue,
  onChangeText,
}: {
  placeholder: string;
  initialValue: string;
  onChangeText: (text: string) => void;
}) => {
  const [value, setValue] = useState(initialValue);
  function handleChanged(text: string) {
    setValue(text);
    onChangeText(text);
  }
  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={handleChanged}
    />
  );
};

const GratitudeLog = ({ onDismiss }: { onDismiss: (msg: string) => void }) => {
  const db = useDatabase();
  const settings = useSettings();
  const logLines = useRef(Array(settings.gratitudeBatch).fill('')).current;

  function setLogLine(index: number, value: string) {
    logLines[index] = value;
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
            <LogLine
              key={i}
              placeholder={'Entry ' + (i + 1)}
              initialValue={v}
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
