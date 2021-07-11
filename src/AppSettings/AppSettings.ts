interface AppSettings {
  logBatch: number;
  skillsApiUrl: string;
}

export const defaultSettings: AppSettings = {
  logBatch: 3,
  skillsApiUrl: 'https://skillsapi.albemuth.net',
};

export default AppSettings;
