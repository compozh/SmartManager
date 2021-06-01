module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    "plugin:vue/essential",
    "@vue/standard"
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    parser: 'babel-eslint'
  },
  plugins: [
    'vue'
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'indent': ['error', 2, { "SwitchCase": 1 }],
    'no-extra-semi':'error',
    'semi':['error','never'],
    'quotes':['error', 'single'],
    'curly':"error",
    "key-spacing": ["error", { "beforeColon": false, "afterColon": true, "mode": "strict"  }],
    'block-spacing': "error",
    "space-infix-ops": ["error", {"int32Hint": false}],
    "space-before-blocks":["error"],
    "keyword-spacing":["error"],
    "brace-style":["error","1tbs", { "allowSingleLine": true }],
    "arrow-spacing":["error"]
  }
}
