import Markdown from 'react-native-markdown-display';
import React, { useState } from 'react';
import SkillSearchResult from '../../models/SkillSearchResult';
import SkillsApi from '../../api/SkillsApi';
import { Button, ScrollView, StyleSheet } from 'react-native';
import { Dialog, Portal, Text } from 'react-native-paper';
import { useAppContext } from '../../AppContext';
import { useEffect } from 'react';

const SkillDetail = ({
  skill,
  onDismiss,
}: {
  skill: SkillSearchResult;
  onDismiss: () => void;
}) => {
  const { db, settings } = useAppContext();

  const [skillDetail, setSkillDetail] = useState(skill);

  useEffect(() => {
    if (skill.contents == null) {
      SkillsApi.getSkillDetail(settings, skill.file_id).then(res => {
        if (res.success && res.data != null) {
          const newDetail = { ...skillDetail };
          const content = res.data.content;
          newDetail.contents = content;
          setSkillDetail(newDetail);
          if (content != null) {
            db.updateSkillContent(skill.id, content);
          }
        }
      });
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  return (
    <Portal>
      <Dialog visible={true} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title style={styles.title}>{skillDetail.title}</Dialog.Title>
        <Dialog.Content style={styles.content}>
          <ScrollView style={styles.scroll}>
            {!skillDetail.contents && <Text>{skillDetail.summary}</Text>}
            {skillDetail.contents && (
              <Markdown>{skillDetail.contents}</Markdown>
            )}
          </ScrollView>
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

export default SkillDetail;
