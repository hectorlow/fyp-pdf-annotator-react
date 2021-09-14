module.exports = {
  env: {
    browser: true,
    webextensions: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'max-len': [2, { code: 80, tabWidth: 2, ignoreUrls: true }],
    'max-lines': ['error', { skipBlankLines: true, skipComments: true }],
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
    'jsx-a11y/control-has-associated-label': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'src'],
      },
      alias: {
        map: [
          ['src', './src'],
        ],
      },
    },
  },
};
