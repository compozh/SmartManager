<template>
	<v-container class="column pa-0 fill-height" fluid >
    <v-card v-if="version" class="version-title-card" :style="attitude == 'right' ? 'right: 0;justify-content:flex-end;' : 'left: 0;justify-content:flex-start;' ">
      {{version.name}}
    </v-card>
    <v-row class="fill-height" v-if="loading" justify="center" align="center">
      <v-progress-circular :size="70" :width="7" color="primary" indeterminate />
    </v-row>
    <div class="modeler" ref="container"></div>
    <v-row class="options-panel grey lighten-4 ">
      <v-btn text :disabled="!canZoom" @click="onZoomIn" :title="$t('bpmn.labels.ZoomIn')">
        <v-icon size="20">mdi-magnify-plus-outline</v-icon>
      </v-btn>
      <v-btn text :disabled="!canZoom" @click="onZoomOut" :title="$t('bpmn.labels.ZoomOut')">
        <v-icon size="20">mdi-magnify-minus-outline</v-icon>
      </v-btn>
      <v-btn text :disabled="!canZoom" @click="onZoomReset" :title="$t('bpmn.labels.ResetZoom')">
        <v-icon size="20">mdi-magnify-close</v-icon>
      </v-btn>
      <v-divider vertical></v-divider>
      <v-btn text :disabled="!canMinimap" @click="onMinimap" :title="$t('bpmn.labels.ToggleMinimap')">
        <v-icon>mdi-map</v-icon>
      </v-btn>
      <v-btn v-if="fullScreenVisible" text @click="fullScreen = !fullScreen" :title="$t('bpmn.labels.ToggleFullScreen')">
        <v-icon v-if="fullScreen">mdi-fullscreen-exit</v-icon>
        <v-icon v-else>mdi-fullscreen</v-icon>
      </v-btn>
    </v-row>
	</v-container>
</template>

<script>
import { Diagram, DiagramType, DiagramVersion } from '../../api/models';
import { editorFactory } from '../../api';
import { editorToolbarMixin, fullScreenMixin } from '../mixins';
import { Notification } from 'element-ui';
import moment from 'moment';
export default {
  name: 'copmpare-modeler',
  mixins: [ editorToolbarMixin, fullScreenMixin ],
  data () {
    return {
      loading: false,
      split: null,
      modeler: null,
    };
  },
  props: {
    diagram: Object,
    version: Object,
    type: String,
    fullScreenVisible: Boolean,
    attitude: String,
    parrentEl: HTMLDivElement
  },

  mounted() {
    if (this.version && (this.version.id || this.version.versionId)) {
      this.createModeler();
    }
  },
  methods: {
    getFullScreenContainer() {
      return this.parrentEl;
    },
    createModeler() {
      this.destroyModeler();
      this.modeler = editorFactory(this.type, true, this.$refs.container, this.translate);
      this.onEditorChanged();
      this.loadXml();
    },
    async loadXml() {
      if (!this.version || !this.modeler) { return; }
      this.loading = true;
      let xml;
      if (this.version instanceof DiagramVersion) {
        xml = await this.$store.dispatch('bpmn/getDiagramVersionXml', {versionId: this.version.versionId, diagramId: this.diagram.id});
      } else {
        xml = await this.$store.dispatch('bpmn/getXml', this.version.id);
      }
      if (xml) {
        this.modeler.importXML(xml, (err) => {
          this.loading = false;
          this.$emit('compare');
          if (err) {
            console.error(err);
            Notification.error(this.$t('bpmn.Errors.ProcessesNotLoaded'));
            this.loading = false;
          }
        });
      }
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
      this.createModeler();
    }
  }
};
</script>
<style lang="scss" >
  .modeler {
    height: 100%;
    width: 100%;
    background: white;
    position: relative;
  }

</style>
<style lang="scss" scoped>
  .options-panel {
    position: absolute;
    background-color: #f5f5f5;
    bottom: 20px;
    right: 30px;
    // height: 20px;
    border: 1px solid #CCC;
    border-radius: 2px;
    z-index: 50;
    .v-btn {
      min-width: 45px !important
    }
  }
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
  .version-title-card {
    position: absolute;
    z-index: 100;
    margin: 20px;
    display: flex;
    padding: 10px;
    align-self: flex-start;
    min-width: 150px;
    background: rgb(	238, 238, 238 );
    opacity: 0.6 !important;
    border-radius: 5px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  }
  .version-title-card:hover {
    opacity: 1 !important;
  }
</style>
