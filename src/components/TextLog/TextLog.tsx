import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { Title, Button, TextInput, Portal, Dialog } from 'react-native-paper';
import { useAppContext } from '../../AppContext';
import LogDef from '../../models/LogDef';
import LogProps from '../../models/LogProps';

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

const TextLog = ({ logId, onDismiss }: LogProps) => {
  const { db, settings } = useAppContext();
  const logLines = useRef(Array(settings.logBatch).fill('')).current;
  const [logDef, setLogDef] = useState<LogDef | null>(null);

  useEffect(() => {
    async function initTextLog() {
      const row = await db.readLogDef(logId);
      if (row != null) {
        setLogDef(row);
      } else {
        onDismiss('Problem loading text log details!');
      }
    }
    initTextLog();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  function setLogLine(index: number, value: string) {
    logLines[index] = value;
  }

  async function saveTextLog() {
    const result = await db.saveTextLog(logId, logLines);
    if (result.success) {
      onDismiss('Thanks!');
    } else {
      onDismiss('There was a problem :(');
    }
  }

  return (
    <Portal>
      <Dialog visible={logDef != null} onDismiss={() => onDismiss('')}>
        <Dialog.Title>{logDef?.title}</Dialog.Title>
        <Dialog.Content>
          <Title>{logDef?.question}</Title>
          {logLines.map((v, i) => (
            <LogLine
              key={i}
              placeholder={'Entry ' + (i + 1)}
              initialValue={v}
              onChangeText={text => setLogLine(i, text)}
            />
          ))}
          <Button mode="contained" onPress={saveTextLog}>
            Save
          </Button>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

export default TextLog;
