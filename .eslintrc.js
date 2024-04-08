module.exports = {
  env: {
    es2021: true,
  },
  extends: ['google', 'eslint:recommended', 'plugin:prettier/recommended'],
  overrides: [
    {
      env: {
        node: true,
      },
      'parserOptions': {
        'sourceType': 'script',
      },
    },
  ],
  parserOptions: {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  rules: {
    'require-jsdoc': 0,
  },
};
