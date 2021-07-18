import { PermissionsAndroid, Platform } from 'react-native';
import { Dirs, FileSystem } from 'react-native-file-access';

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
      await FileSystem.cpExternal(
        Dirs.DatabaseDir + '/dbt.db',
        'pwa.db',
        'downloads',
      ); // copies our file to the downloads folder/directory
      // file should now be visible in the downloads folder
    }

    return;
  }
};

export default backupDatabase;
