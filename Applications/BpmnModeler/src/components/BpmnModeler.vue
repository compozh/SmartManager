<template>
  <modeler-layout :process="process" :loading="loading" :saved="saved">
    <template #modeler>
      <div class="workflow-modeler" ref="container"></div>
    </template>
    <template #propertiesPanel>
      <div ref="propertiesPanel"></div>
    </template>
  </modeler-layout>
</template>
<script>
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';

import { debounce } from 'throttle-debounce';
import { CancellationToken } from '../api/cancellationToken'
import { SavingContext } from '../api/savingContext';
import { exportMixin } from './mixins/importExportMixin';
import Process from '../api/models/Process';
import editorFactory from '../api/editorFactory';
import ModelerLayout from './ModelerLayout';
import ProcessType from '../api/models/ProcessType';

export default {
  name: 'bpmn-modeler',
  mixins: [ exportMixin ],
  components: { ModelerLayout },
  data() {
    return {
      modeler: null,
      loading: false,
      saved: false,
      cancellationToken: new CancellationToken(),
      onElementChanged: null,
    };
  },
  mounted() {
    if (this.process) {
      this.createModeler();
      this.onActiveModelChanged();
    }
  },
  computed: {
    process() {
      const activeItem = this.$store.state.bpmn.activeItem;
      if (activeItem && activeItem instanceof Process && activeItem.type === ProcessType.BPMN) {
        return activeItem;
      }
      return null;
    }
  },
  beforeDestroy: function () {
    this.destroyModeler();
  },
  watch: {
    process(value, oldValue) {
      if (!value) {
        this.destroyModeler();
      }
      if (!oldValue || !this.modeler || value.type !== oldValue.type) {
        this.createModeler();
      }
      this.onActiveModelChanged();
    }
  },
  methods: {
    createModeler() {
      this.destroyModeler();
      this.modeler = editorFactory(this.process.type, false, this.$refs.container, this.$refs.propertiesPanel, this.translate);
    },    
    async loadXml() {
      if (!this.process || !this.modeler) {
        return;
      }
      this.loading = true;
      if (!this.cancellationToken.isCancelled) {
        this.cancellationToken.cancel();
      }
      const debounced = debounce(500, async (cancellationToken) => {
        const xml = await this.$store.dispatch('bpmn/getXml', this.process.id);
        if (cancellationToken.isCancelled) {
          return;
        }
        if (xml === false) {
          this.loading = false;
          // TODO: display exception
          return;
        }
        if (!xml || xml === '') {
          this.modeler.createDiagram(() => {
            this.loading = false;
          });        
        } else {
          this.modeler.importXML(xml, (err) => {
            this.loading = false;
            if (err) {
              console.error(err);
              // TODO: display exception
              this.modeler.createDiagram();
              this.loading = false;
            }
          });
        }
      });

      this.cancellationToken = new CancellationToken(debounced);
      debounced(this.cancellationToken);
    },
    setXML(id, xml) {
      this.$store.dispatch('bpmn/setXml', { id, xml }).then(success => {
        if (success) {
          this.saved = true;
          setTimeout(() => this.saved = false, 1000);
        } else {
          // TODO: display exception
        }
      });
    },
    onActiveModelChanged() {
      if (!this.process || !this.modeler) {
        return;
      }
      this.modeler.clear();
      if (this.onElementChanged) {
        this.modeler.off('element.changed', this.onElementChanged);
      }
      this.onElementChanged = debounce(1000, function() {
        this.saveXML();
      });
      this.modeler.on('element.changed', this.onElementChanged, new SavingContext(this.modeler, this.process.id, (id, xml) => this.setXML(id, xml)));
      this.loadXml();
    },
    translate(template, replacements) {
      const translationPrefix = 'bpmn.modeler.';
      replacements = replacements || {};

      for (let replacement in replacements) {
        // Попробовать перевести замены
        const translationKey = translationPrefix + replacements[replacement];
        const translation = this.$t(translationKey);
        if (translation != translationKey) {
          replacements[replacement] = translation;
        }
      }

      // Перевести шаблон
      const translationKey = translationPrefix + template;
      const translation = this.$t(translationKey, replacements);

      if (translation !== translationKey) {
        return translation;
      } else {
        return template.replace(/{([^}]+)}/g, function(_, key) {
          return replacements[key] || '{' + key + '}';
        });
      }
    },
    destroyModeler() {
      if (this.modeler) {
        this.modeler.destroy();
        this.modeler = null;
      }
    }
  }
};
</script>
<style>

</style>
