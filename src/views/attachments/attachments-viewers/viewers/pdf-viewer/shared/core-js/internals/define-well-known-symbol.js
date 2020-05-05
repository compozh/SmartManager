var path = require('./path')
var has = require('./has')
var wrappedWellKnownSymbolModule = require('./wrapped-well-known-symbol')
var defineProperty = require('./object-define-property').f

module.exports = function (NAME) {
  var Symbol = path.Symbol || (path.Symbol = {})
  if (!has(Symbol, NAME)) {
    defineProperty(Symbol, NAME, {
      value: wrappedWellKnownSymbolModule.f(NAME)
    })
  }
}
