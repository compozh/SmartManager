var anObject = require('./an-object')
var getIteratorMethod = require('./get-iterator-method')

module.exports = function (it) {
  var iteratorMethod = getIteratorMethod(it)
  if (typeof iteratorMethod != 'function') {
    throw TypeError(String(it) + ' is not iterable')
  } return anObject(iteratorMethod.call(it))
}
