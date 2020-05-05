var fails = require('./fails')
var wellKnownSymbol = require('./well-known-symbol')

var SPECIES = wellKnownSymbol('species')

module.exports = function (METHOD_NAME) {
  return !fails(function () {
    var array = []
    var constructor = array.constructor = {}
    constructor[SPECIES] = function () {
      return { foo: 1 }
    }
    return array[METHOD_NAME](Boolean).foo !== 1
  })
}
