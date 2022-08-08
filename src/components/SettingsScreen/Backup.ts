import Result, { result } from '../../models/Result';
import { DateTime } from 'luxon';
import { PermissionsAndroid, Platform } from 'react-native';
import { Dirs, FileSystem } from 'react-native-file-access';

const permissionWriteExternalStorage = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

const backupDatabase: () => Promise<Result> = async () => {
  if (Platform.OS === 'android') {
    const permissionGranted = await permissionWriteExternalStorage();
    if (!permissionGranted) {
      return result(false, 'Permission was not given');
    } else {
      const dateStamp = DateTime.now().toFormat('yyyy-MM-dd_HH:mm:ss');
      const backupFilename = `pwa-${dateStamp}.db`;
      await FileSystem.cpExternal(
        Dirs.DatabaseDir + '/dbt.db',
        backupFilename,
        'downloads',
      ); // copies our file to the downloads folder/directory
      // file should now be visible in the downloads folder
      return result(true);
    }
  }

  return result(false, `Platform ${Platform.OS} not supported yet`);
};

export default backupDatabase;
