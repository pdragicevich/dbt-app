import React from 'react';
import { Dialog, Portal, Text } from 'react-native-paper';
import SkillSearchResult from '../../models/SkillSearchResult';

const SkillDetail = ({
  skill,
  onDismiss,
}: {
  skill: SkillSearchResult;
  onDismiss: () => void;
}) => (
  <Portal>
    <Dialog visible={true} onDismiss={onDismiss}>
      <Dialog.Title>{skill.title}</Dialog.Title>
      <Dialog.Content>
        <Text>{skill.summary}</Text>
      </Dialog.Content>
    </Dialog>
  </Portal>
);

export default SkillDetail;
