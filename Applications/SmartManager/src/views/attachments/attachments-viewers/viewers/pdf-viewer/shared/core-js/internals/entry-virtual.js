var global = require('./global')

module.exports = function (CONSTRUCTOR) {
  return global[CONSTRUCTOR].prototype
}
