export const importMixin = {
  methods: {
    importItem(parent) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.bpmn';

      input.addEventListener('change', () => {
        const [file] = input.files;
        if (!file) {
          return;
        }
        file.text().then(xml => {
          setTimeout(function () {
            document.body.removeChild(input);
          }, 0);

          this.createItem(parent, 'process', xml);
        });
      });
      document.body.appendChild(input);
      input.click();
    },
  }
};
export const exportMixin = {
  methods: {
    export(type) {
      let fileName = 'diagram.' + type;

      const save = function (fileName, data) {
        const file = new Blob([data]);
        const a = document.createElement('a');
        const url = URL.createObjectURL(file);
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 0);
      };

      switch (type) {
      case 'bpmn':
        this.modeler.saveXML({ format: true }, (err, xml) => {
          if (err) {
            return;
          }
          save(fileName, xml);
        });
        break;
      case 'svg':
        this.modeler.saveSVG((err, svg) => {
          if (err) {
            return;
          }
          save(fileName, svg);
        });
      }
    }
  }
}