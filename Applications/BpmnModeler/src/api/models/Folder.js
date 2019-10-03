export default class Folder {
  constructor({ id, name = '', parentId, isSystem = false, items = [] } = {}) {
    this.id = id;
    this.name = name;
    this.parentId = parentId;
    this.items = items;
    this.isSystem = isSystem;
  }
  get isFolder() {
    return true;
  }
}