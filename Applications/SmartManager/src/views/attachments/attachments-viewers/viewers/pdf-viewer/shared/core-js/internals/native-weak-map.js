var global = require('./global')
var nativeFunctionToString = require('./function-to-string')

var WeakMap = global.WeakMap

module.exports = typeof WeakMap === 'function' && /native code/.test(nativeFunctionToString.call(WeakMap))
