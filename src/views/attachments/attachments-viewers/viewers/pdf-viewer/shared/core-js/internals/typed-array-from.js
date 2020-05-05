var toObject = require('./to-object')
var toLength = require('./to-length')
var getIteratorMethod = require('./get-iterator-method')
var isArrayIteratorMethod = require('./is-array-iterator-method')
var bind = require('./bind-context')
var aTypedArrayConstructor = require('./array-buffer-view-core').aTypedArrayConstructor

module.exports = function from(source /* , mapfn, thisArg */) {
  var O = toObject(source)
  var argumentsLength = arguments.length
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined
  var mapping = mapfn !== undefined
  var iteratorMethod = getIteratorMethod(O)
  var i, length, result, step, iterator, next
  if (iteratorMethod != undefined && !isArrayIteratorMethod(iteratorMethod)) {
    iterator = iteratorMethod.call(O)
    next = iterator.next
    O = []
    while (!(step = next.call(iterator)).done) {
      O.push(step.value)
    }
  }
  if (mapping && argumentsLength > 2) {
    mapfn = bind(mapfn, arguments[2], 2)
  }
  length = toLength(O.length)
  result = new (aTypedArrayConstructor(this))(length)
  for (i = 0; length > i; i++) {
    result[i] = mapping ? mapfn(O[i], i) : O[i]
  }
  return result
}
