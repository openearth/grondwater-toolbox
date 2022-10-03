module.exports = {
  root: true,
  env: {
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  globals: {
    chrome: true,
    Vue: 'readable',
  },
  plugins: [ 'vue' ], // required to lint *.vue files
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
  ],
  rules: {
    'array-bracket-spacing': [ 'warn', 'always' ],
    'brace-style': [ 'warn', '1tbs' ],
    'curly': [ 'warn', 'all' ],
    'comma-dangle': [ 'error', 'always-multiline' ],
    'eol-last': [ 'error', 'always' ],
    'jsx-quotes': [ 'error', 'prefer-double' ],
    'keyword-spacing': [ 'warn', { 'before': true, 'after': true } ],
    'semi': [ 'error', 'always' ],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 'warn',
    'object-curly-spacing': [ 'warn', 'always' ],
    'quotes': [ 'error', 'single' ],
    'template-curly-spacing': [ 'warn', 'always' ],
    'vue/max-attributes-per-line': [ 'error', { singleline: 2 } ],
    'vue/no-unused-components': 'warn',
    'vue/script-indent': [ 'error', 2, { baseIndent: 1 } ],
    'vue/no-v-html': 'off',
  },
};
