var classof = require('./classof')
var wellKnownSymbol = require('./well-known-symbol')
var Iterators = require('./iterators')

var ITERATOR = wellKnownSymbol('iterator')

module.exports = function (it) {
  var O = Object(it)
  return O[ITERATOR] !== undefined
    || '@@iterator' in O
    // eslint-disable-next-line no-prototype-builtins
    || Iterators.hasOwnProperty(classof(O))
}
