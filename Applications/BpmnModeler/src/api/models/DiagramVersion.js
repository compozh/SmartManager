export default class DiagramVersion {
  constructor({ diagramId, versionId, name, creatorId, creatorName, creationTime, editorId, editorName, editTime, xmlView } = {}) {
    this.diagramId = diagramId;
    this.versionId = versionId;
    this.name = name;
    this.creatorId = creatorId;
    this.creatorName = creatorName;
    this.creationTime = creationTime;
    this.editorId = editorId;
    this.editorName = editorName;
    this.editTime = editTime;
    this.xmlView = xmlView;
  }
}