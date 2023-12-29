module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
    commonjs: true,
  },
  extends: [
    'eslint:recommended',
    'eslint-config-prettier',
    'eslint-config-standard',
  ],
  plugins: ['import', 'node', 'promise'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    semi: ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'no-unused-vars': 'warn',
    'no-console': 'off',
    'space-before-function-paren': 'off',
    camelcase: [
      'error',
      {
        allow: ['_id', '_key', '_email', '_uri', '_url', '_domain'],
      },
    ],
  },
};
