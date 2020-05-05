'use strict'
var getBuiltIn = require('./get-built-in')
var definePropertyModule = require('./object-define-property')
var wellKnownSymbol = require('./well-known-symbol')
var DESCRIPTORS = require('./descriptors')

var SPECIES = wellKnownSymbol('species')

module.exports = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME)
  var defineProperty = definePropertyModule.f

  if (DESCRIPTORS && Constructor && !Constructor[SPECIES]) {
    defineProperty(Constructor, SPECIES, {
      configurable: true,
      get: function () { return this }
    })
  }
}
