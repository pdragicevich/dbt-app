interface AppSettings {
  logBatch: number;
  skillsApiUrl: string;
}

export const defaultSettings: AppSettings = {
  logBatch: 3,
  skillsApiUrl: 'http://192.168.162.200:5000',
};

export default AppSettings;
