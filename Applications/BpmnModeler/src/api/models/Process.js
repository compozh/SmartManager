import ProcessType from './ProcessType';

export default class Process {
  constructor({ id = null, name = '', parentId = null, type = ProcessType.BPMN , xmlView }) {
    this.id = id;
    this.name = name;
    this.parentId = parentId;
    this.type = type;
    this.xmlView = xmlView;
  }
  get isFolder() {
    return false;
  }
}