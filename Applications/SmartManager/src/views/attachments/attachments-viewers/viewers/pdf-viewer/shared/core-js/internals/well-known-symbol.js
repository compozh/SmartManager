var global = require('./global')
var shared = require('./shared')
var uid = require('./uid')
var NATIVE_SYMBOL = require('./native-symbol')

var Symbol = global.Symbol
var store = shared('wks')

module.exports = function (name) {
  return store[name] || (store[name] = NATIVE_SYMBOL && Symbol[name]
    || (NATIVE_SYMBOL ? Symbol : uid)('Symbol.' + name))
}
