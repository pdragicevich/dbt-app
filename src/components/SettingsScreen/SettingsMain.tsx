import { useAppContext } from '../../AppContext';
import SkillsApi from '../../api/SkillsApi';
import backupDatabase from './Backup';
import { SettingsScreenProps } from './SettingsScreen';
import React from 'react';
import { View } from 'react-native';
import { Button, Subheading } from 'react-native-paper';

const SettingsMain = ({ navigation }: SettingsScreenProps) => {
  const { db, settings, setSnackbar } = useAppContext();

  async function initDb() {
    let success = false;
    try {
      const result = await db.rebuild();
      success = result.success;
      if (!result.success) {
        console.error('initDb', result);
      }
    } catch (ex) {
      console.error('initDb', ex);
    }
    if (success) {
      setSnackbar({ message: 'Rebuilt OK!' });
    } else {
      setSnackbar({ message: 'There was a problem doing that!' });
    }
  }

  async function reloadSkills() {
    let success = false;
    const skills = await SkillsApi.getSkillsSummary(settings);
    if (skills.success && skills.data != null) {
      const dbResult = await db.saveSkills(skills.data);
      if (dbResult.success) {
        success = true;
      }
    }
    if (success) {
      setSnackbar({ message: 'Reloaded skills OK!' });
    } else {
      setSnackbar({ message: 'There was a problem doing that.' });
    }
  }

  async function backup() {
    try {
      const backupResult = await backupDatabase();
      if (backupResult.success) {
        setSnackbar({ message: 'Backed up successfully!' });
      } else {
        setSnackbar({ message: backupResult.message ?? 'Unable to backup' });
      }
    } catch (ex) {
      db.insertAppLog('error', `SettingsScreen backup ${ex}`);
      console.error('SettingsScreen backup ERROR', ex);
      setSnackbar({ message: 'Sorry, there was a problem doing that' });
    }
  }

  function customiseTodoList() {
    navigation.navigate('todo');
  }

  return (
    <View>
      <Subheading>Customisation</Subheading>
      <Button icon="database" mode="contained" onPress={customiseTodoList}>
        Customise to-do list
      </Button>

      <Subheading>Backup</Subheading>
      <Button icon="database" mode="contained" onPress={backup}>
        Backup
      </Button>

      <Subheading>Dangerous operations</Subheading>
      <Button icon="alert" mode="contained" onPress={initDb}>
        Re-initialise database
      </Button>
      <Button icon="alert" mode="contained" onPress={reloadSkills}>
        Reload skills
      </Button>
    </View>
  );
};

export default SettingsMain;
