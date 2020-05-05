var IS_PURE = require('./is-pure')
var store = require('./shared-store');

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {})
})('versions', []).push({
  version: '3.3.2',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
})
