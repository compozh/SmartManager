export default class Folder {
  constructor({ id, name = '', parentId, isSystem = false, items = [], rights = [], ownerId = '', editorId = '', creationDate, editDate } = {}) {
    this.id = id;
    this.name = name;
    this.parentId = parentId;
    this.items = items;
    this.isSystem = isSystem;
    this.rights = rights;
    this.ownerId = ownerId;
    this.editorId = editorId;
    this.creationDate = creationDate;
    this.editDate = editDate;
  }
  get isFolder() {
    return true;
  }
  hasRight(right) {
    return this.rights.includes(right);
  }
}