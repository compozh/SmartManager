export default class Folder {
  constructor({ id, name = '', parentId, items = [] } = {}) {
    this.id = id;
    this.name = name;
    this.parentId = parentId;
    this.items = items;
  }
  get isFolder() {
    return true;
  }
}