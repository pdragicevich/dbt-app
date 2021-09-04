interface AppSettings {
  textLogBatch: number;
  skillsApiUrl: string;
  skillsSearchDebounceMs: number;
  snackbarDurationMs: number;
}

export const defaultSettings: AppSettings = {
  textLogBatch: 3,
  skillsApiUrl: 'https://skillsapi.albemuth.net',
  skillsSearchDebounceMs: 300,
  snackbarDurationMs: 3000,
};

export default AppSettings;
