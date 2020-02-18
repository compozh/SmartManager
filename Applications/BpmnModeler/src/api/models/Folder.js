export default class Folder {
  constructor({ id, name = '', parentId, isSystem = false, items = [], rights = [],  ownerId = '', 
    editorId = '', creationTime, editTime, ownerName = '', editorName = '', usersWithAccess = [] } = {}) {
    this.id = id;
    this.name = name;
    this.parentId = parentId;
    this.items = items;
    this.isSystem = isSystem;
    this.rights = rights;
    this.ownerId = ownerId;
    this.ownerName = ownerName;
    this.editorId = editorId;
    this.editorName = editorName;
    this.creationTime = creationTime;
    this.editTime = editTime;
    this.usersWithAccess = usersWithAccess;
  }
  get isFolder() {
    return true;
  }
  hasRight(right) {
    return this.rights.includes(right);
  }
}