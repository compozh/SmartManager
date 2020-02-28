module.exports = {
  'env': [
    'eslint:recommended',
    'plugin:vue/essential'
  ],

  'extends': [
    'eslint:recommended',
    'plugin:vue/essential'
  ],

  'plugins': [
    'vue',
    'vuetify'
  ],

  root: true,

  env: {
    browser: true,
    es6: true,
    node: true
  },

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'indent': ['error', 2, {
      "ignoredNodes": ["TemplateLiteral"]
    }],
    'no-extra-semi':'error',
    'quotes':['error', 'single'],
    'curly':"error",
    "key-spacing": ["error", { "beforeColon": false, "afterColon": true, "mode": "strict"  }],
    'block-spacing': "error",
    "space-infix-ops": ["error", {"int32Hint": false}],
    "space-before-blocks":["error"],
    "keyword-spacing":["error"],
    "brace-style":["error","1tbs", { "allowSingleLine": true }],
    "arrow-spacing":["error"],
    "no-unused-vars": "off",
    'vuetify/no-deprecated-classes': 'error',
    'vuetify/grid-unknown-attributes': 'error',
    'vuetify/no-legacy-grid': 'error',
    'semi': ['error', 'always'],
    'no-dupe-else-if': 'error',
    'no-await-in-loop': 'error',
    'no-import-assign': 'error',
    'array-callback-return': 'error',
    'block-scoped-var': 'error'
  },

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    parser: 'babel-eslint'
  }
}
