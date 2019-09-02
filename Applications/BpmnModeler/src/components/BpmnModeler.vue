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
      <div class="bpmn-diagram-container" ref="container"></div>
      <div class="properties-panel-container">
        <div class="properties-panel-parent" ref="propertiesPanel"></div>
      </div>
      <v-tooltip v-model="saved" activator=".bpmn-diagram-container" bottom>
        <span>{{ $tc('ProcessSaved') }}</span>
      </v-tooltip>
    </v-layout>
  </v-layout>
</template>
<script>
import BpmnModeler from 'bpmn-js/lib/Modeler';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/bpmn';
import { debounce } from 'throttle-debounce';
import { CancellationToken } from '../api/cancellationToken'
import { SavingContext } from '../api/savingContext';

export default {
  name: 'bpmn-modeler',
  data() {
    return {
      modeler: {},
      loading: false,
      saved: false,
      cancellationToken: new CancellationToken(),
      onElementChanged: null,
      diagramId: ''
    };
  },
  mounted() {
    this.modeler = new BpmnModeler({ 
      container: this.$refs.container,
      propertiesPanel: {
        parent: this.$refs.propertiesPanel
      },
      additionalModules: [
        propertiesPanelModule,
        propertiesProviderModule
      ],
    });
    const canvas = this.modeler.get('canvas');
    canvas.zoom('fit-viewport');
    this.onRouteChanged();
  },
  computed: {
    activeModel() {
      return this.$store.state.bpmn.activeModel;
    }
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
        console.log(xml);
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
      if (this.onElementChanged) {
        this.modeler.off('element.changed', this.onElementChanged);
      }
      this.onElementChanged = debounce(1000, function() {
        this.saveXML();
      });
      this.modeler.on('element.changed', this.onElementChanged, new SavingContext(this.modeler, this.diagramId, (id, xml) => this.setXML(id, xml)));
      this.loadXml();
    }
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
}
.properties-panel-parent:empty {
  display: none;
}
.properties-panel-parent > * {
  min-height:100%;
}
</style>
