import React, { useEffect, useState } from 'react';
import { Dialog, List, Portal, Title } from 'react-native-paper';
import { useAppContext } from '../../AppContext';
import LogDef from '../../models/LogDef';
import LogItem from '../../models/LogItem';
import LogProps from '../../models/LogProps';

interface OptionLogState {
  logDef: LogDef;
  logItems: LogItem[];
}

const OptionLog = ({ logId, onDismiss }: LogProps) => {
  const { db } = useAppContext();

  const [state, setState] = useState<OptionLogState | null>(null);

  useEffect(() => {
    async function initOptionLog() {
      const logDef = await db.readLogDef(logId);
      const logItems = await db.getOptionLogItems(logId);
      if (logDef != null && logItems.length > 0) {
        setState({ logDef, logItems });
      } else {
        onDismiss('Problem loading option log details!');
      }
    }
    initOptionLog();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  async function setOptionLog(logItem: LogItem) {
    const result = await db.saveOptionLog(logId, logItem.value);
    if (result.success) {
      onDismiss(logItem.message);
    } else {
      onDismiss('There was a problem :(');
    }
  }
  return (
    <Portal>
      <Dialog visible={state != null} onDismiss={() => onDismiss('')}>
        <Dialog.Title>{state?.logDef.title}</Dialog.Title>
        <Dialog.Content>
          <Title>{state?.logDef.question}</Title>
          {state?.logItems.map(i => (
            <List.Item
              key={i.value}
              title={i.label}
              left={props =>
                i.icon != null ? (
                  <List.Icon {...props} icon={i.icon} />
                ) : undefined
              }
              onPress={() => setOptionLog(i)}
            />
          ))}
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

export default OptionLog;
