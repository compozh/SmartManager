<template>
  <v-layout fill-height>
    <v-layout v-if="loading" column justify-center align-center>
      <v-progress-circular
        :size="70"
        :width="7"
        color="primary"
        indeterminate
      >
      </v-progress-circular>
    </v-layout>
    <v-layout v-if="!loading && noAccess" column justify-center align-center>
      <h2>{{ $t('bpmn.labels.NoReadAccess') }}</h2>
    </v-layout>
    <div class="modeler-grid" :class="{ 'no-panel': !showPanel }" v-show="diagram && !loading && !noAccess"  ref="layout">
      <v-toolbar dense height="40" flat class="modeler-toolbar">
        <v-btn flat :disabled="!canUndo" @click="$emit('undo')" :title="$t('bpmn.labels.Undo')">
          <v-icon>undo</v-icon>
        </v-btn>
        <v-btn flat :disabled="!canRedo" @click="$emit('redo')" :title="$t('bpmn.labels.Redo')">
          <v-icon>redo</v-icon>
        </v-btn>
        <v-divider vertical></v-divider>
        <v-btn flat :disabled="!canZoom" @click="$emit('zoom-in')" :title="$t('bpmn.labels.ZoomIn')">
          <v-icon>zoom_in</v-icon>
        </v-btn>
        <v-btn flat :disabled="!canZoom" @click="$emit('zoom-out')" :title="$t('bpmn.labels.ZoomOut')">
          <v-icon>zoom_out</v-icon>
        </v-btn>
        <v-btn flat :disabled="!canZoom" @click="$emit('zoom-reset')" :title="$t('bpmn.labels.ResetZoom')">
          <v-icon>mdi-magnify-close</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn flat :disabled="!canMinimap" @click="$emit('minimap')" :title="$t('bpmn.labels.ToggleMinimap')">
          <v-icon>map</v-icon>
        </v-btn>
        <v-btn flat @click="fullScreen = !fullScreen" :title="$t('bpmn.labels.ToggleFullScreen')">
          <v-icon v-if="fullScreen">fullscreen_exit</v-icon>
          <v-icon v-else>fullscreen</v-icon>
        </v-btn>
        <!-- <v-divider vertical></v-divider>
        <v-btn flat @click="panel = !panel" :disabled="!canShowPanel" :title="$t('bpmn.labels.TogglePropertiesPanel')">
          <v-icon>mdi-settings</v-icon>
        </v-btn> -->
      </v-toolbar>
      <Split v-if="canShowPanel" @onDragEnd="onSplitDragEnd" :gutterSize="12">
        <SplitArea :size="100 - splitSize">
          <div class="bpmn-diagram-container">
            <slot name="modeler"></slot>
          </div>
        </SplitArea>
        <SplitArea :size="splitSize" :minSize="0">
          <div class="properties-panel-container">
            <slot name="propertiesPanel"></slot>
          </div>
        </SplitArea>
      </Split>
      <div v-else class="bpmn-diagram-container">
        <slot name="modeler"></slot>
      </div>
      <v-tooltip v-model="saved" activator=".bpmn-diagram-container" bottom>
        <span>{{ $t('bpmn.labels.ProcessSaved') }}</span>
      </v-tooltip>
    </div>
  </v-layout>
</template>
<script>
import 'diagram-js-minimap/assets/diagram-js-minimap.css';
import Diagram from '../../api/models/Diagram';
import { fullScreenMixin } from '../mixins';

export default {
  name: 'modeler-layout',
  mixins: [ fullScreenMixin ],
  props: {
    diagram: Diagram,
    loading: Boolean,
    saved: Boolean,
    canUndo: Boolean,
    canRedo: Boolean,
    canMinimap: { },
    canZoom: { },
    canShowPanel: {
      type: Boolean,
      default() {
        return true;
      }
    },
    noAccess: Boolean
  },
  data() { 
    return {
      panel: !this.$vuetify.breakpoint.xs,
      isFullScreen: false
    }
  },
  computed: {
    showPanel: {
      get() {
        return this.canShowPanel && this.panel
      },
      set(value) {
        this.panel = value;
      }
    },
    splitSize: {
      get() {
        return Number.parseInt(localStorage.getItem('properties-panel-split-size') || 20);
      },
      set(value) {
        localStorage.setItem('properties-panel-split-size', value);
      }
    }
  },
  methods: {
    getFullScreenContainer() {
      return this.$refs.layout;
    },
    onSplitDragEnd(size) {
      this.splitSize = 100 - Number.parseInt(size);
    }
  }
}
</script>
<style>
.modeler-grid {
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: white;
  display: grid;
  grid-template-rows: 40px 1fr;
  grid-template-areas: 
    "toolbar"
    "modeler";
}
.modeler-toolbar {
  grid-area: toolbar;
  border-bottom: rgba(0,0,0,.12) 1px solid;
  grid-area: toolbar;
}
.modeler-toolbar button {
  min-width: 36px;
  margin: 0;
  padding: 0;
}
.modeler-toolbar .v-divider.v-divider--vertical {
  margin: 0 24px;
}
.bpmn-diagram-container {
  width: 100%;
  height: 100%;
  grid-area: modeler;
}
.modeler-grid.no-panel {
  height: calc(100% - 81px);
}
.bpmn-diagram-container .workflow-modeler {
  width: 100%;
  height: 100%;
  position: relative;
}
.properties-panel-container > * >:first-child {
  overflow-y: auto;
  display: contents;
}
a.bjs-powered-by {
  z-index: 4 !important;
}
.djs-minimap .toggle {
  display: none;
}
.djs-popup-body .entry {
  text-align: left;
}
.dmn-decision-table-container .powered-by-logo .logo,
a.bjs-powered-by {
  display: none;
}
.bpmn-icon-colorize::before {
  content: "\F0E3";
  font-family: "Material Design Icons";
  padding-top: 3px;
}
</style>