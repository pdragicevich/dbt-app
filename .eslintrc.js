module.exports = {
  parser: '@typescript-eslint/parser',
  root: true,
  extends: ['plugin:@typescript-eslint/recommended', '@react-native-community'],
  rules: {
    // disable the rule for all files
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
};
