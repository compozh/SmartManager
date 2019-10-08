import ProcessType from './ProcessType';

export default class Process {
  constructor({ id = null, name = '', parentId = null, isSystem = false, type = ProcessType.BPMN, xmlView } = {}) {
    this.id = id;
    this.name = name;
    this.parentId = parentId;
    this.type = type;
    this.xmlView = xmlView;
    this.isSystem = isSystem;
  }
  get isFolder() {
    return false;
  }
}