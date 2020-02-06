import Canvg from 'canvg';
import { eventBus } from '../../main';
import { events } from '../../constants';

export const importMixin = {
  methods: {
    importItem(parent) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.bpmn, .dmn';
      input.style.display = 'none';

      input.addEventListener('change', () => {
        const [file] = input.files;
        if (!file) {
          return;
        }
        file.text().then(xml => {
          setTimeout(function () {
            document.body.removeChild(input);
          }, 0);
          let type  = file.type || file.name.includes('.bpmn') ? 'BPMN' : file.name.includes('.dmn') ? 'DMN' : ''
            if(type != 'BPMN' && type != 'DMN') {
              return Notification.error(element.$t('bpmn.errors.ProcessNotCreated'))
            }
          this.createItem(parent, 'process', xml, [{name: file.name, type}]);
        });
      });
      document.body.appendChild(input);
      input.click();
    },
  }
};
export const exportMixin = {
  mounted() {
    eventBus.$on(events.modeler.export, this.export);
  },
  beforeDestroy() {
    eventBus.$off(events.modeler.export, this.export);
  },
  methods: {
    export(type) {
      let fileName = 'diagram.' + type;

      const save = function (fileName, data) {
        const file = new Blob([data]);
        const a = document.createElement('a');
        a.style.display = 'none';
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
      case 'dmn':
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
        break;
      case 'png':
        this.modeler.saveSVG((err, svg) => {
          if (err) {
            return;
          }
          var canvas = document.createElement('canvas');
          Canvg(canvas, svg);

          var dataURL = canvas.toDataURL('image/png');
          var data = atob(dataURL.substring('data:image/png;base64,'.length)),
            asArray = new Uint8Array(data.length);

          for (var i = 0, len = data.length; i < len; ++i) {
            asArray[i] = data.charCodeAt(i);
          }

          save(fileName, asArray.buffer);
        });
        break;
      }
    }
  }
}