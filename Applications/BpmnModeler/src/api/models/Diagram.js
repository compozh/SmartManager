import DiagramType from './DiagramType';

export default class Diagram {
  constructor({ id = null, name = '', parentId = null, isSystem = false, type = DiagramType.BPMN, xmlView, rights = [], ownerId = '', editorId = '',
    creationTime, editTime, ownerName = '', editorName = '', usersWithAccess = [] } = {}) {
    this.id = id;
    this.name = name;
    this.parentId = parentId;
    this.type = type;
    this.xmlView = xmlView;
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
    return false;
  }
  hasRight(right) {
    return this.rights.includes(right);
  }
}