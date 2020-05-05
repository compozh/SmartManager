'use strict'
var path = require('./path')
var aFunction = require('./a-function')
var anObject = require('./an-object')
var create = require('./object-create')
var createNonEnumerableProperty = require('./create-non-enumerable-property')
var redefineAll = require('./redefine-all')
var wellKnownSymbol = require('./well-known-symbol')
var InternalStateModule = require('./internal-state')

var setInternalState = InternalStateModule.set
var getInternalState = InternalStateModule.get

var TO_STRING_TAG = wellKnownSymbol('toStringTag')

var $return = function (value) {
  var iterator = getInternalState(this).iterator
  var $$return = iterator['return']
  return $$return === undefined ? { done: true, value: value } : anObject($$return.call(iterator, value))
}

var $throw = function (value) {
  var iterator = getInternalState(this).iterator
  var $$throw = iterator['throw']
  if ($$throw === undefined) { throw value }
  return $$throw.call(iterator, value)
}

module.exports = function (nextHandler, IS_ITERATOR) {
  var IteratorProxy = function Iterator(state) {
    state.next = aFunction(state.iterator.next)
    state.done = false
    setInternalState(this, state)
  }

  IteratorProxy.prototype = redefineAll(create(path.Iterator.prototype), {
    next: function next() {
      var state = getInternalState(this)
      var result = state.done ? undefined : nextHandler.apply(state, arguments)
      return { done: state.done, value: result }
    },
    'return': $return,
    'throw': $throw
  })

  if (!IS_ITERATOR) {
    createNonEnumerableProperty(IteratorProxy.prototype, TO_STRING_TAG, 'Generator')
  }

  return IteratorProxy
}
