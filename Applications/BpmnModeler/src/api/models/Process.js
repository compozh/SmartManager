export default class Process {
  constructor({ id = null, name = '', parentId = null, xmlView } = {}) {
    this.id = id;
    this.name = name;
    this.parentId = parentId;
    this.xmlView = xmlView;
  }
  get isFolder() {
    return false;
  }
}