import React, { useState } from 'react';
import { useEffect } from 'react';
import { Dialog, Portal, Text } from 'react-native-paper';
import SkillsApi from '../../api/SkillsApi';
import { useAppContext } from '../../AppContext';
import SkillSearchResult from '../../models/SkillSearchResult';
import Markdown from 'react-native-markdown-display';

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
    console.log(settings);
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
      <Dialog visible={true} onDismiss={onDismiss}>
        <Dialog.Title>{skillDetail.title}</Dialog.Title>
        <Dialog.Content>
          {!skillDetail.contents && <Text>{skillDetail.summary}</Text>}
          {skillDetail.contents && <Markdown>{skillDetail.contents}</Markdown>}
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

export default SkillDetail;
