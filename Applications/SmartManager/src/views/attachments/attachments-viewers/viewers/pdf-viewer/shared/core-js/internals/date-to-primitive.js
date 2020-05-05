'use strict'
var anObject = require('./an-object')
var toPrimitive = require('./to-primitive')

module.exports = function (hint) {
  if (hint !== 'string' && hint !== 'number' && hint !== 'default') {
    throw TypeError('Incorrect hint')
  } return toPrimitive(anObject(this), hint !== 'number')
}
