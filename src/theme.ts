import { DefaultTheme } from 'react-native-paper';

// declare global {
//   namespace ReactNativePaper {
//     interface ThemeColors {
//       myOwnColor: string;
//     }

//     interface Theme {
//       myOwnProperty: boolean;
//     }
//   }
// }

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#DDE392',
    accent: '#f1c40f',
  },
};

export default theme;
