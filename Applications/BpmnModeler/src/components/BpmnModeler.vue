<template>
  <v-layout fill-height>
    <div class="bpmn-diagram-container with-diagram">
      <div class="canvas" ref="container"></div>
      <div class="properties-panel-parent" ref="propertiesPanel"></div>
    </div>
    <v-tooltip v-model="saved" activator=".bpmn-diagram-container" bottom>
          <span>{{ $tc('ProcessSaved') }}</span>
        </v-tooltip>
    <v-dialog v-model="loading"
                full-width
                persistent>
      <v-progress-circular
        :size="70"
        :width="7"
        indeterminate>
      </v-progress-circular>
    </v-dialog>
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
      onElementChanged: null
    };
  },
  computed: {
    activeModel() {
      return this.$store.state.bpmn.activeModel;
    }
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

    this.onActiveModelChanged();
  },
  watch: {
    activeModel: {
      handler(value, oldValue) {
        if (value.id === oldValue.id) {
          return;
        }
        this.onActiveModelChanged();
      }
    }
  },
  methods: {
    async loadXml() {
      if (!this.activeModel.id) {
        return;
      }

      this.loading = true;

      if (!this.cancellationToken.isCancelled) {
        this.cancellationToken.cancel();
      }
      
      const debounced = debounce(500, async (cancellationToken) => {
        const xml = await this.$store.dispatch('bpmn/getXml', this.activeModel.id);
        if (cancellationToken.isCancelled) {
          return;
        }
        if (!xml) {
          // TODO: display exception
          return;
        }
        this.modeler.importXML(xml, (err) => {
          this.loading = false;
          if (err) {
            console.error(err);
            // TODO: display exception
            this.modeler.createDiagram();
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
      this.modeler.on('element.changed', this.onElementChanged, new SavingContext(this.modeler, this.activeModel, (id, xml) => this.setXML(id, xml)));
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
}
.canvas {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
.properties-panel-parent {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 260px;
  z-index: 10;
  border-left: 1px solid #ccc;
  overflow: auto;
}
.properties-panel-parent:empty {
  display: none;
}
.properties-panel-parent > .djs-properties-panel {
  padding-bottom: 70px;
  min-height:100%;
}
</style>
