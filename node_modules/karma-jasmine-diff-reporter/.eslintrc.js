module.exports = {
  root: true,
  extends: 'eslint-config-es5',
  env: {
    node: true,
    jasmine: true,
  },
  rules: {
    'func-names': 0,
    'no-param-reassign': 0,
    'space-before-function-paren': [2, {
      'anonymous': 'always',
      'named': 'never'
    }],
  }
};
