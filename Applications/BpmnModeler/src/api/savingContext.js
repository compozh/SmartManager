export class SavingContext {
  constructor(modeler, model, callback) {
    this.modeler = modeler;
    this.model = model;
    this.callback = callback;
  }

  saveXML() {
    this.modeler.saveXML((err, xml) => {
      if (err) {
        console.error(err);
        return;
      }
      this.callback(this.model.id, xml);
    });
  }
}