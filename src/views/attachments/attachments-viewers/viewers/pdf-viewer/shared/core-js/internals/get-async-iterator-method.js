var getIteratorMethod = require('./get-iterator-method')
var wellKnownSymbol = require('./well-known-symbol')

var ASYNC_ITERATOR = wellKnownSymbol('asyncIterator')

module.exports = function (it) {
  var method = it[ASYNC_ITERATOR]
  return method === undefined ? getIteratorMethod(it) : method
}
