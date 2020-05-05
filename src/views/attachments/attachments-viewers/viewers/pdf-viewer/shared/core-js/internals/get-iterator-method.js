var classof = require('./classof')
var Iterators = require('./iterators')
var wellKnownSymbol = require('./well-known-symbol')

var ITERATOR = wellKnownSymbol('iterator')

module.exports = function (it) {
  if (it != undefined) {
    return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)]
  }
}
