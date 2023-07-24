'use strict';

module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    babelOptions: {
      root: __dirname,
    },
  },
  plugins: ['ember'],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    browser: true,
  },
  rules: {
    'no-var': 'error',
    semi: ['error', 'always'],
    'ember/no-actions-hash': 'off',
    'ember/no-classic-classes': 'off',
    'ember/no-classic-components': 'off',
    'ember/no-component-lifecycle-hooks': 'off',
    'ember/no-get': 'off',
    'ember/no-new-mixins': 'off',
    'ember/no-old-shims': 'error',
    'ember/new-module-imports': 'error',
    'ember/no-jquery': 'off',
    'ember/no-mixins': 'off',
    'ember/no-side-effects': 'error',
    'ember/require-return-from-computed': 'off',
    'ember/require-tagless-components': 'off',
    'no-prototype-builtins': 'off',
  },
  overrides: [
    // node files
    {
      files: [
        './.eslintrc.cjs',
        './.prettierrc.js',
        './.template-lintrc.cjs',
        './addon-main.cjs',
      ],
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        browser: false,
        node: true,
      },
      plugins: ['n'],
      extends: ['plugin:n/recommended'],
    },
  ],
};
