'use strict'
var toPrimitive = require('./to-primitive')
var definePropertyModule = require('./object-define-property')
var createPropertyDescriptor = require('./create-property-descriptor')

module.exports = function (object, key, value) {
  var propertyKey = toPrimitive(key)
  if (propertyKey in object) { definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value)) } else { object[propertyKey] = value }
}
