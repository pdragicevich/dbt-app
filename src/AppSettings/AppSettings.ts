interface AppSettings {
  textLogBatch: number;
  skillsApiUrl: string;
  snackbarDurationMs: number;
}

export const defaultSettings: AppSettings = {
  textLogBatch: 3,
  skillsApiUrl: 'https://skillsapi.albemuth.net',
  snackbarDurationMs: 3000,
};

export default AppSettings;
