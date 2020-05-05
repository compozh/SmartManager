var IS_PURE = require('./is-pure')
var getIterator = require('./get-iterator')

module.exports = IS_PURE ? getIterator : function (it) {
  // eslint-disable-next-line no-undef
  return Set.prototype.values.call(it)
}
