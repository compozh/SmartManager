export default class Configuration {
  constructor({ canModifySystemObjects = false } = {}) {
    this.canModifySystemObjects = canModifySystemObjects;
  }
}