var anObject = require('./an-object')
var isObject = require('./is-object')
var newPromiseCapability = require('./new-promise-capability')

module.exports = function (C, x) {
  anObject(C)
  if (isObject(x) && x.constructor === C) { return x }
  var promiseCapability = newPromiseCapability.f(C)
  var resolve = promiseCapability.resolve
  resolve(x)
  return promiseCapability.promise
}
