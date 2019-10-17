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
    <div class="modeler-grid" v-show="process && !loading"  ref="layout">
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
        <v-divider vertical></v-divider>
        <v-btn flat @click="panel = !panel" :title="$t('bpmn.labels.TogglePropertiesPanel')">
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
import 'diagram-js-minimap/assets/diagram-js-minimap.css';

import Process from '../api/models/Process';
export default {
  name: 'modeler-layout',
  props: {
    process: Process,
    loading: Boolean,
    saved: Boolean,
    canUndo: Boolean,
    canRedo: Boolean,
    canMinimap: { },
    canZoom: { }
  },
  data() { 
    return {
      panel: !this.$vuetify.breakpoint.xs,
      isFullScreen: false
    }
  },
  mounted() {
    document.addEventListener('fullscreenchange', this.onFullScreenChanged);
    document.addEventListener('mozfullscreenchange', this.onFullScreenChanged);
    document.addEventListener('webkitfullscreenchange', this.onFullScreenChanged);
    document.addEventListener('msfullscreenchange', this.onFullScreenChanged);
  },
  beforeDestroy() {
    document.removeEventListener('fullscreenchange', this.onFullScreenChanged);
    document.removeEventListener('mozfullscreenchange', this.onFullScreenChanged);
    document.removeEventListener('webkitfullscreenchange', this.onFullScreenChanged);
    document.removeEventListener('msfullscreenchange', this.onFullScreenChanged);
  },
  computed: {
    fullScreen: {
      get() {
        return this.isFullScreen;
      },
      set(value) {
        const element = this.$refs.layout;
        if (value) {
          if (element.requestFullscreen) {
            element.requestFullscreen();
          } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
          } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
          } else if (document.documentElement.webkitRequestFullscreen) {
            element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          }
        }
        this.isFullScreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
      }
    }
  },
  methods: {
    onFullScreenChanged() {
      this.isFullScreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
    },
  }
}
</script>
<style>
:root {
  --main-color: #1976d2;
  --main-gradient: rgba(25, 118, 210, 0.2);
}

.modeler-grid {
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: white;
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
.modeler-toolbar .v-divider.v-divider--vertical {
  margin: 0 24px;
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
.djs-minimap .toggle {
  display: none;
}
.bpp-properties-group.group-closed {
  max-height: 30px;
}
.bpp-textfield .search {
  background: transparent;
  border: none;
  top: 0;
  right: 0;
}
.bpp-properties-panel button.search:before {
  content: "\F349";
  font: normal normal normal 24px/1 "Material Design Icons";
}
.bpp-properties-panel button.search {
  padding: 0;
  margin-top: 3px;
  margin-right: 3px;
  height: 23px;
}
.djs-popup-body .entry {
  text-align: left;
}
.dmn-decision-table-container .powered-by-logo .logo,
a.bjs-powered-by {
  display: none;
}
.bpp-entry-link {
  color: var(--main-color);
}
ul.bpp-properties-tabs-links > li.bpp-active a {
  border-top: 2px solid var(--main-color);
}
.bpp-properties-group > .group-toggle:hover {
    background-color: var(--main-color);
}
.bpp-properties-panel button:hover {
    color: var(--main-color);
}
.bpp-properties-panel input:focus, 
.bpp-properties-panel button:focus, 
.bpp-properties-panel textarea:focus, 
.bpp-properties-panel [contenteditable]:focus {
    border-color: var(--main-color);
    box-shadow: 0 0 1px 2px var(--main-gradient);
}
.bpp-properties-group.group-closed {
    background-color: var(--main-gradient);
}
.bpp-properties-group:hover > .group-toggle:hover {
    background-color: var(--main-color);
}
.bpp-properties-group.group-closed:hover > .group-label {
    color: var(--main-color);
}
</style>