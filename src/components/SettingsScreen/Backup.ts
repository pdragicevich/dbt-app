import { PermissionsAndroid, Platform } from 'react-native';
import { Dirs, FileSystem } from 'react-native-file-access';
import { DateTime } from 'luxon';

const permissionWriteExternalStorage = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    {
      title: 'Permission to back up database',
      message: 'PWA yeah',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    },
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

const backupDatabase = async () => {
  if (Platform.OS === 'android') {
    const permissionGranted = await permissionWriteExternalStorage();
    if (permissionGranted) {
      const dateStamp = DateTime.now().toFormat('yyyy-MM-dd_HH:mm:ss');
      const backupFilename = `pwa-${dateStamp}.db`;
      await FileSystem.cpExternal(
        Dirs.DatabaseDir + '/dbt.db',
        backupFilename,
        'downloads',
      ); // copies our file to the downloads folder/directory
      // file should now be visible in the downloads folder
    }

    return;
  }
};

export default backupDatabase;
