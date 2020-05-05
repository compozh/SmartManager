'use strict'
var anObject = require('./an-object')
var aFunction = require('./a-function')

// https://github.com/tc39/collection-methods
module.exports = function (/* ...elements */) {
  var set = anObject(this)
  var adder = aFunction(set.add)
  for (var k = 0, len = arguments.length; k < len; k++) {
    adder.call(set, arguments[k])
  }
  return set
}
