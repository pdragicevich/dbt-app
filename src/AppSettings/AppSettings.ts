interface AppSettings {
  gratitudeBatch: number;
  skillsApiUrl: string;
}

export const defaultSettings: AppSettings = {
  gratitudeBatch: 3,
  skillsApiUrl: 'http://192.168.162.200:5000',
};

export default AppSettings;
