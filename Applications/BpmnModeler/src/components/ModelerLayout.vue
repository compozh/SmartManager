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
    <div class="modeler-grid" v-show="process && !loading">
      <v-toolbar dense height="40" flat class="modeler-toolbar">
        <v-spacer></v-spacer>
        <v-btn flat @click="panel = !panel">
          <v-icon>mdi-settings</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="bpmn-diagram-container">
        <slot name="modeler"></slot>
      </div>
      <v-navigation-drawer v-model="panel" class="properties-panel-container"
        clipped
        right
        disable-resize-watcher
        hide-overlay
        :width="panel ? $vuetify.breakpoint.xs ? $vuetify.breakpoint.width : 320 : 0">
        <slot name="propertiesPanel"></slot>
      </v-navigation-drawer>
      <v-tooltip v-model="saved" activator=".bpmn-diagram-container" bottom>
        <span>{{ $t('bpmn.labels.ProcessSaved') }}</span>
      </v-tooltip>
    </div>
  </v-layout>
</template>
<script>
import Process from '../api/models/Process';
export default {
  name: 'modeler-layout',
  props: {
    process: Process,
    loading: Boolean,
    saved: Boolean,
  },
  data() { 
    return {
      panel: !this.$vuetify.breakpoint.xs
    }
  },
  computed: {
    showExtension() {
      return this.tabs && this.tabs.length > 0;
    },
    active: {
      get() {
        return this.activeTab;
      },
      set(value) {
        this.$emit('update:activeTab', value);
      }
    }
  },
}
</script>
<style>
.modeler-grid {
  position: absolute;
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-areas: 
  "toolbar toolbar"
  "modeler properties-panel";
  grid-template-rows: 40px 1fr;
  grid-template-columns: 1fr auto;
  gap: 0;
}
.modeler-toolbar {
  grid-area: toolbar;
  border-bottom: rgba(0,0,0,.12) 1px solid;
}
.modeler-toolbar button {
  min-width: 36px;
  margin: 0;
  padding: 0;
}
.bpmn-diagram-container {
  position: absolute;
  width: 100%;
  height: 100%;
  grid-area: modeler;
}
.bpmn-diagram-container .workflow-modeler {
  position: relative;
  width: 100%;
  height: 100%;
}
.properties-panel-container {
  grid-area: properties-panel;
}
.properties-panel-container > * >:first-child {
  width: 100%;
  position: absolute;
  height: 100%;
  text-align: start;
}
a.bjs-powered-by {
  z-index: 4 !important;
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