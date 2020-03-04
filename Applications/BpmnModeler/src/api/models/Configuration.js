export default class Configuration {
  constructor({ canModifySystemObjects = false, itObjects } = {}) {
    this.canModifySystemObjects = canModifySystemObjects;
    this.itObjects = new ItObjects(itObjects);
  }

  /** @type {boolean} */
  canModifySystemObjects

  /** @type {ItObjects} */
  itObjects
}

class ItObjects {
  constructor({ isMobj = false, userDefaultObject, userAccessObjects  = []} = {}) {
    this.isMobj = isMobj;
    this.userDefaultObject = userDefaultObject;
    this.userAccessObjects = userAccessObjects.map(obj => new AccessObject(obj));
  }

  /** @type {boolean} */
  isMobj

  /** @type {string} */
  userDefaultObject

  /** @type {AccessObject[]} */
  userAccessObjects
}

class AccessObject {
  constructor({ kobj, nobj } = {}) {
    this.kobj = kobj;
    this.nobj = nobj;
  }

  /** @type {string} */
  kobj
  
  /** @type {string} */
  nobj
}