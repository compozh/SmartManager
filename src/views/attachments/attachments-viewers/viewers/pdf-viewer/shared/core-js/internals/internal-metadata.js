var hiddenKeys = require('./hidden-keys')
var isObject = require('./is-object')
var has = require('./has')
var defineProperty = require('./object-define-property').f
var uid = require('./uid')
var FREEZING = require('./freezing')

var METADATA = uid('meta')
var id = 0

var isExtensible = Object.isExtensible || function () {
  return true
}

var setMetadata = function (it) {
  defineProperty(it, METADATA, { value: {
    objectID: 'O' + ++id, // object ID
    weakData: {}          // weak collections IDs
  } })
}

var fastKey = function (it, create) {
  // return a primitive with prefix
  if (!isObject(it)) { return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it }
  if (!has(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) { return 'F' }
    // not necessary to add metadata
    if (!create) { return 'E' }
    // add missing metadata
    setMetadata(it)
  // return object ID
  } return it[METADATA].objectID
}

var getWeakData = function (it, create) {
  if (!has(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) { return true }
    // not necessary to add metadata
    if (!create) { return false }
    // add missing metadata
    setMetadata(it)
  // return the store of weak collections IDs
  } return it[METADATA].weakData
}

// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZING && meta.REQUIRED && isExtensible(it) && !has(it, METADATA)) { setMetadata(it) }
  return it
}

var meta = module.exports = {
  REQUIRED: false,
  fastKey: fastKey,
  getWeakData: getWeakData,
  onFreeze: onFreeze
}

hiddenKeys[METADATA] = true
