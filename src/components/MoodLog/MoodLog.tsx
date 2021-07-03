import React from 'react';
import { Dialog, List, Portal } from 'react-native-paper';
import { useAppContext } from '../../AppContext';
import Mood from '../../models/Mood';

const Moods: Mood[] = [
  {
    label: 'Very happy',
    value: 5,
    icon: 'emoticon-excited-outline',
    message: 'So good!',
  },
  {
    label: 'Mildly happy',
    value: 4,
    icon: 'emoticon-happy-outline',
    message: 'Happy days!',
  },
  {
    label: 'Neutral',
    value: 3,
    icon: 'emoticon-neutral-outline',
    message: 'Thanks!',
  },
  {
    label: 'Not so good',
    value: 2,
    icon: 'emoticon-sad-outline',
    message: 'Sorry to hear that.',
  },
  {
    label: 'Unhappy',
    value: 1,
    icon: 'emoticon-frown-outline',
    message: 'Hope things pick up soon.',
  },
];

const MoodLog = ({ onDismiss }: { onDismiss: (msg: string) => void }) => {
  const { db } = useAppContext();
  async function setMood(moodDef: Mood) {
    const result = await db.saveMood(moodDef.value);
    if (result.success) {
      onDismiss(moodDef.message);
    } else {
      onDismiss('There was a problem :(');
    }
  }
  return (
    <Portal>
      <Dialog visible={true} onDismiss={() => onDismiss('')}>
        <Dialog.Title>How are you feeling?</Dialog.Title>
        <Dialog.Content>
          {Moods.map(m => (
            <List.Item
              key={m.value}
              title={m.label}
              left={props => <List.Icon {...props} icon={m.icon} />}
              onPress={() => setMood(m)}
            />
          ))}
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

export default MoodLog;
