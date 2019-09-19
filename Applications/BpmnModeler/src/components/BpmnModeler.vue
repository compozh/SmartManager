<template>
  <v-layout fill-height>
    <v-layout v-show="loading" column justify-center align-center>
      <v-progress-circular
        :size="70"
        :width="7"
        color="primary"
        indeterminate>
      </v-progress-circular>
    </v-layout>
    <v-layout fill-height v-show="!loading">
      <div class="bpmn-diagram-container" ref="container">
        <v-btn
          v-model="panel"
          class="properties-panel-button"
          color="blue darken-2"
          dark
          absolute
          top
          right
          fab
          small
          @click="panel = !panel"
          >
            <v-icon>mdi-arrow-expand-left</v-icon>
            <v-icon>mdi-arrow-collapse-right</v-icon>
        </v-btn>
      </div>
      <v-navigation-drawer v-model="panel"
        app
        clipped
        right
        :width="panel ? $vuetify.breakpoint.xs ? $vuetify.breakpoint.width : 320 : 0">
        <div class="properties-panel-parent" ref="propertiesPanel"></div>
        <v-btn
          v-model="panel"
          class="properties-panel-button"
          color="blue darken-2"
          dark
          absolute
          top
          right
          fab
          small
          v-if="$vuetify.breakpoint.xs"
          @click="panel = !panel">
            <v-icon>mdi-arrow-expand-left</v-icon>
            <v-icon>mdi-arrow-collapse-right</v-icon>
        </v-btn>
      </v-navigation-drawer>
      <v-tooltip v-model="saved" activator=".bpmn-diagram-container" bottom>
        <span>{{ $tc('bpmn.labels.ProcessSaved') }}</span>
      </v-tooltip>
    </v-layout>
  </v-layout>
</template>
<script>
import BpmnModeler from 'bpmn-js/lib/Modeler';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from '../bpmnModules/provider/camunda/';
import camundaExtensionModule from 'camunda-bpmn-moddle/lib';
import camundaModdle  from 'camunda-bpmn-moddle/resources/camunda';
import { debounce } from 'throttle-debounce';
import { CancellationToken } from '../api/cancellationToken'
import { SavingContext } from '../api/savingContext';
import { exportMixin } from './mixins/importExportMixin';

export default {
  name: 'bpmn-modeler',
  mixins: [ exportMixin ],
  data() {
    return {
      modeler: {},
      loading: false,
      saved: false,
      cancellationToken: new CancellationToken(),
      onElementChanged: null,
      diagramId: '',
      panel: !this.$vuetify.breakpoint.xs
    };
  },
  mounted() {
    const customTranslateModule = {
      translate: [ 'value', (t, r) => this.translate(t, r) ]
    };
    this.modeler = new BpmnModeler({ 
      container: this.$refs.container,
      propertiesPanel: {
        parent: this.$refs.propertiesPanel
      },
      additionalModules: [
        propertiesPanelModule,
        propertiesProviderModule,
        camundaExtensionModule,
        customTranslateModule
      ],
      moddleExtensions: {
        camunda: camundaModdle
      }
    });
    const canvas = this.modeler.get('canvas');
    canvas.zoom('fit-viewport');
    this.onRouteChanged();
  },
  computed: {
    activeModel() {
      return this.$store.state.bpmn.activeModel;
    },
  },
  watch: {
    '$route': 'onRouteChanged'
  },
  methods: {
    onRouteChanged() {
      if (!this.$store.state.authentication.currentUser) {
        return;
      }
      const diagramId = this.$route.params.id;
      if (diagramId !== '' && diagramId !== this.diagramId) {
        this.diagramId = diagramId;
        this.onActiveModelChanged();
      }
    },
    async loadXml() {
      if (!this.diagramId || this.diagramId === '') {
        return;
      }

      this.loading = true;

      if (!this.cancellationToken.isCancelled) {
        this.cancellationToken.cancel();
      }
      
      const debounced = debounce(500, async (cancellationToken) => {
        const xml = await this.$store.dispatch('bpmn/getXml', this.diagramId);
        if (cancellationToken.isCancelled) {
          return;
        }
        if (xml === false) {
          this.loading = false;
          // TODO: display exception
          return;
        }
        this.modeler.importXML(xml, (err) => {
          this.loading = false;
          if (err) {
            console.error(err);
            // TODO: display exception
            this.modeler.createDiagram();
            this.loading = false;
          }
        });
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
      this.modeler.clear();
      if (this.onElementChanged) {
        this.modeler.off('element.changed', this.onElementChanged);
      }
      this.onElementChanged = debounce(1000, function() {
        this.saveXML();
      });
      this.modeler.on('element.changed', this.onElementChanged, new SavingContext(this.modeler, this.diagramId, (id, xml) => this.setXML(id, xml)));
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
  }
};
</script>
<style>
.bpmn-diagram-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.canvas {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.properties-panel-container {
  width: 320px;
  border-left: 1px solid #ccc;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
}
.properties-panel-parent {
  width: 100%;
  position: absolute;
  height: 100%;
  text-align: start;
}
.properties-panel-parent:empty {
  display: none;
}
.properties-panel-parent > * {
  min-height:100%;
}
a.bjs-powered-by {
  z-index: 4 !important;
}
.properties-panel-button {
  top: 16px !important;
}
.bpp-properties-panel input {
  background-color: white;
}
.bpp-properties-panel select {
  color: black;
  text-transform: none;
  background-color: white;
  border-style: solid;
}
.bpp-properties-panel select[data-value] {
  -webkit-appearance: menulist;
}
.bpp-table-row > button {
  height: 29px;
}
.bpp-properties-panel button:before {
  top: -2px;
}
.bpp-table-row > button:before {
  top: 0;
}
.bpp-textfield button:before {
    top: 0;
}
</style>
