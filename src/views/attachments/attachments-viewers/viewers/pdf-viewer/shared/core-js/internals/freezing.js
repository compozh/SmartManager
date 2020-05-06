var fails = require('./fails')

module.exports = !fails(function () {
  return Object.isExtensible(Object.preventExtensions({}))
})
