import React, { useState } from 'react';
import { useEffect } from 'react';
import { Button, StyleSheet } from 'react-native';
import { Dialog, Portal, Text } from 'react-native-paper';
import { useAppContext } from '../../AppContext';
import Nullable from '../../models/Nullable';
import Version from '../../models/Version';
import { nowYear } from '../../utils';

const AboutPopup = ({ onDismiss }: { onDismiss: () => void }) => {
  const { db, config } = useAppContext();
  const [version, setVersion] = useState<Nullable<Version>>(null);

  useEffect(() => {
    async function getVersion() {
      const dbVersion = await db.getVersion();
      setVersion(dbVersion);
    }
    getVersion();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  return (
    <Portal>
      <Dialog visible={true} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title style={styles.title}>
          {config.appDisplayName}
        </Dialog.Title>
        <Dialog.Content style={styles.content}>
          {version && (
            <Text>
              Version {version.version} ({version.title})
            </Text>
          )}
          <Text>Written by Paul Dragicevich {nowYear()}</Text>
        </Dialog.Content>
        <Dialog.Actions style={styles.actions}>
          <Button onPress={onDismiss} title="Done">
            Done
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  title: {
    margin: 0,
    padding: 0,
  },
  content: {
    maxHeight: '70%',
  },
  actions: {},
  scroll: {
    margin: 0,
    padding: 0,
  },
});

export default AboutPopup;
