// eslint-disable-next-line no-undef
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
      '@typescript-eslint',
    ],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier',
      'prettier/@typescript-eslint',
    ],
    "rules": {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off"
    }
  };