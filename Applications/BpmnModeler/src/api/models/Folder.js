export default class Folder {
  constructor({ id, name = '', parentId, isSystem = false, items = [], rights = [ ] } = {}) {
    this.id = id;
    this.name = name;
    this.parentId = parentId;
    this.items = items;
    this.isSystem = isSystem;
    this.rights = rights;
  }
  get isFolder() {
    return true;
  }
  hasRight(right) {
    return this.rights.includes(right);
  }
}