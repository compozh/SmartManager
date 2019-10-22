export default class SavingContext {
  constructor(modeler, diagramId, callback) {
    this.modeler = modeler;
    this.diagramId = diagramId;
    this.callback = callback;
  }

  saveXML() {
    this.modeler.saveXML((err, xml) => {
      if (err) {
        console.error(err);
        return;
      }
      this.callback(this.diagramId, xml);
    });
  }
}