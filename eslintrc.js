const path = require('path');

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  'extends': [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: path.resolve(__dirname,'./tsconfig.json'),
    tsconfigRootDir: __dirname,
  },
  env: {
    node: true,
    commonjs: true,
    es6: true,
    jest: true,
  },
  rules: {
    // '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/indent': 'off',
    'camelcase': ['error', { properties: 'always' }],
    'id-blacklist': ['error', 'any', 'Number', 'number', 'String', 'string', 'Boolean', 'boolean', 'Undefined', 'undefine'],
    indent: 'off',
    'max-len': ['error', { code: 150 }],
    'member-ordering': 'off',
    'object-literal-sort-keys': 'off',
    quotes: ['error','single'],
  },
  settings: {},
};
