<template>
	<v-container class="column pa-0 fill-height" fluid >
    <v-row class="fill-height" v-if="loading" justify="center" align="center">
      <v-progress-circular :size="70" :width="7" color="primary" indeterminate />
    </v-row>
    <div class="modeler" ref="container"></div>
	</v-container>
</template>

<script>
import { debounce } from 'throttle-debounce';
import { Diagram, DiagramType, DiagramVersion } from '../../api/models';
import { CancellationToken, editorFactory } from '../../api';
import { editorToolbarMixin } from '../mixins';
import { Notification } from 'element-ui';
import moment from 'moment';
export default {
  name: 'copmpare-modeler',
  mixins: [ editorToolbarMixin ],
  data () {
    return {
      loading: false,
      split: null,
      modeler: null,
      cancellationToken: new CancellationToken(),
    };
  },
  props: {
    diagram: Object,
    version: Object,
    type: String
  },

  mounted() {
    if (this.version) {
      this.createModeler();
    }
  },
  methods: {
    createModeler() {
      this.destroyModeler();
      this.modeler = editorFactory(this.type, true, this.$refs.container, null, this.translate);
      this.onEditorChanged();
      this.loadXml()
    },    
    async loadXml() {
      if (!this.version || !this.modeler) {
        return;
      }
      this.loading = true;
      if (!this.cancellationToken.isCancelled) {
        this.cancellationToken.cancel();
      }
      const debounced = debounce(500, async (cancellationToken) => {
        let xml;
        if (this.version instanceof DiagramVersion) {
          xml = await this.$store.dispatch('bpmn/getDiagramVersionXml', {versionId: this.version.versionId, diagramId: this.diagram.id});
        } else {
          xml = await this.$store.dispatch('bpmn/getXml', this.version.id);
        }
        
        if (cancellationToken.isCancelled) {
          return;
        }
        if (xml === false) {
          this.loading = false;
          Notification.error(this.$t('bpmn.Errors.ProcessesNotLoaded'));
          return;
        }
        if (!xml || xml === '') {
          this.modeler.createDiagram(() => {
            this.loading = false;
          });        
        } else {
          this.modeler.importXML(xml, (err) => {
            this.loading = false;
            this.$emit('compare');
            if (err) {
              console.error(err);
              Notification.error(this.$t('bpmn.Errors.ProcessesNotLoaded'));
              this.modeler.createDiagram();
              this.loading = false;
            }
          });
        }
      });

      this.cancellationToken = new CancellationToken(debounced);
      debounced(this.cancellationToken);
    },
    translate(template, replacements) {
      const translationPrefix = 'bpmn.bpmn-modeler.';
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
    },
    getEditorModule(module) {
      if (!this.modeler) {
        return false;
      }
      try {
        return this.modeler.get(module);
      } catch (error) {
        return false;
      }
    }
  
  },
  watch: {
    'version'() {
      this.createModeler()
    }
  }
};
</script>
<style lang="scss">
  .added {
    border: 2px solid green;
    background-color: rgba($color: green, $alpha: 0.2)
  }
  .layoutChanged {
    border: 2px solid blue;
    background-color: rgba($color: blue, $alpha: 0.2)
  }
  .changed {
    border: 2px solid orange;
    background-color: rgba($color: orange, $alpha: 0.2)
  }
  .removed {
    border: 2px solid red;
    background-color: rgba($color: red, $alpha: 0.2)
  }
  .compare-icon::before {
    position: relative;
    top: -26px;
  }
  .modeler {
    height: 100%;
    width: 100%;
    background: white
  }
</style>
