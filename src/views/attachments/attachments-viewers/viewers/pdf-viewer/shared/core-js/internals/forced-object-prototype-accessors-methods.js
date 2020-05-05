'use strict'
var IS_PURE = require('./is-pure')
var global = require('./global')
var fails = require('./fails')

// Forced replacement object prototype accessors methods
module.exports = IS_PURE || !fails(function () {
  var key = Math.random()
  // In FF throws only define methods
  // eslint-disable-next-line no-undef, no-useless-call
  __defineSetter__.call(null, key, function () { /* empty */ })
  delete global[key]
})
