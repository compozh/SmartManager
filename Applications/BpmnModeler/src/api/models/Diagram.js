import DiagramType from './DiagramType';

export default class Diagram {
  constructor({ id = null, name = '', parentId = null, isSystem = false, type = DiagramType.BPMN, xmlView, rights = [], ownerId = '', editorId = '', creationTime, editTime } = {}) {
    this.id = id;
    this.name = name;
    this.parentId = parentId;
    this.type = type;
    this.xmlView = xmlView;
    this.isSystem = isSystem;
    this.rights = rights;
    this.ownerId = ownerId;
    this.editorId = editorId;
    this.creationTime = creationTime
    this.editTime = editTime
  }
  get isFolder() {
    return false;
  }
  hasRight(right) {
    return this.rights.includes(right);
  }
}