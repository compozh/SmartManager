export class SavingContext {
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
      console.log(xml);
      this.callback(this.diagramId, xml);
    });
  }
}