<template>
  <v-layout fill-height>
    <v-layout v-if="loading" fill-height column justify-center align-center>
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
    <div class="modeler-grid" :class="{ 'no-panel': !canShowPanel }" v-show="diagram && !loading && !noAccess"  ref="layout">
      <v-toolbar dense height="40" flat class="modeler-toolbar elevation-1 ">
        <v-spacer></v-spacer>
        <v-btn icon @click="deployItem(diagram)" :disabled="!canDeploy(diagram)" :title="$t('bpmn.buttons.Deploy')">
          <v-icon>mdi-open-in-app</v-icon>
        </v-btn>
        <v-divider vertical></v-divider>
        <v-btn icon @click="showPanel = !showPanel" :disabled="!canShowPanel" :title="$t('bpmn.labels.TogglePropertiesPanel')">
          <v-icon>mdi-settings</v-icon>
        </v-btn>
        <v-btn icon @click="share(diagram)" :disabled="!canShare(diagram)" :title="$t('bpmn.buttons.Share')">
          <v-icon>mdi-account-plus</v-icon>
        </v-btn>
        <bpmn-contex-menu 
          :item="diagram"
          :onlyExport="true"
          @export="exportItem"
          offset>
          <template #activator="{ open }">
            <v-btn icon v-on="open">
              <v-icon>mdi-share-variant</v-icon>
            </v-btn>
          </template>
        </bpmn-contex-menu>
      </v-toolbar>
      <Split v-if="canShowPanel" @onDragEnd="onSplitDragEnd" :gutterSize="12">
        <SplitArea :size="100 - splitSize">
          <div class="bpmn-diagram-container">
            <v-row class="options-panel">
              <v-btn text :disabled="!canUndo" @click="$emit('undo')" :title="$t('bpmn.labels.Undo')">
                <v-icon size="20">mdi-undo</v-icon>
              </v-btn>
              <v-btn text :disabled="!canRedo" @click="$emit('redo')" :title="$t('bpmn.labels.Redo')">
                <v-icon size="20">mdi-redo</v-icon>
              </v-btn>
              <v-divider vertical></v-divider>
              <v-btn text :disabled="!canZoom" @click="$emit('zoom-in')" :title="$t('bpmn.labels.ZoomIn')">
                <v-icon size="20">mdi-magnify-plus-outline</v-icon>
              </v-btn>
              <v-btn text :disabled="!canZoom" @click="$emit('zoom-out')" :title="$t('bpmn.labels.ZoomOut')">
                <v-icon size="20">mdi-magnify-minus-outline</v-icon>
              </v-btn>
              <v-btn text :disabled="!canZoom" @click="$emit('zoom-reset')" :title="$t('bpmn.labels.ResetZoom')">
                <v-icon size="20">mdi-magnify-close</v-icon>
              </v-btn>
              <v-divider vertical></v-divider>
              <v-btn text :disabled="!canMinimap" @click="$emit('minimap')" :title="$t('bpmn.labels.ToggleMinimap')">
                <v-icon size="20">mdi-map</v-icon>
              </v-btn>
              <v-btn text @click="fullScreen = !fullScreen" :title="$t('bpmn.labels.ToggleFullScreen')">
                <v-icon size="20" v-if="fullScreen">mdi-fullscreen-exit</v-icon>
                <v-icon size="20" v-else>mdi-fullscreen</v-icon>
              </v-btn>
            </v-row>
            <slot name="modeler"></slot>
          </div>
        </SplitArea>
        <SplitArea :size="splitSize" :minSize="0">
          <div class="properties-panel-container" v-show="showPanel">
            <slot name="propertiesPanel"></slot>
          </div>
        </SplitArea>
      </Split>
      <div v-else class="bpmn-diagram-container">
        <v-row class="options-panel grey lighten-4 ">
            <v-btn text :disabled="!canMinimap" @click="$emit('minimap')" :title="$t('bpmn.labels.ToggleMinimap')">
              <v-icon>mdi-map</v-icon>
            </v-btn>
            <v-btn text @click="fullScreen = !fullScreen" :title="$t('bpmn.labels.ToggleFullScreen')">
              <v-icon v-if="fullScreen">mdi-fullscreen-exit</v-icon>
              <v-icon v-else>mdi-fullscreen</v-icon>
            </v-btn>
          </v-row>
        <slot name="modeler"></slot>
      </div>
      <v-tooltip v-model="saved" class="tooltip" >
        <span>{{ $t('bpmn.labels.ProcessSaved') }}</span>
      </v-tooltip>
    </div>
  </v-layout>
</template>
<script>
import 'diagram-js-minimap/assets/diagram-js-minimap.css';
import Diagram from '../../api/models/Diagram';
import { eventBus } from '../../main';
import { events } from '../../constants';
import { fullScreenMixin } from '../mixins';
import * as Models from '../../api/models';

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
      isFullScreen: false,
      split: null
    }
  },
  computed: {
    showPanel: {
      get() {
        return this.canShowPanel && this.splitSize > 1
      },
      set(value) {
        if (value && this.splitSize > 1) {
          return;
        }
        this.splitSize = value ? 20 : 1;
      }
    },
    splitSize: {
      get() {
        if (this.split === null) {
          let size = localStorage.getItem('properties-panel-split-size');
          if (typeof size !== 'string' || size === '') {
            size = '20';
          }
          return Number.parseInt(size);
        }
        return this.split;
      },
      set(value) {
        this.split = value;
        localStorage.setItem('properties-panel-split-size', value);
      }
    },
    load: {
      get() {
        return this.loading;
      },
      set(value) {
        if (value === this.loading) {
          return;
        }
        this.$emit('update:loading', value);
      }
    }
  },
  methods: {
    getFullScreenContainer() {
      return this.$refs.layout;
    },
    onSplitDragEnd(size) {
      this.splitSize = 100 - Number.parseInt(size);
    },
    share(item) {
      eventBus.$emit(events.modeler.showAccessDialog, item.id);
    },
    exportItem(item, type) {
      eventBus.$emit(events.modeler.export, type);
    },
    canShare(item) {
      if(!item) return false
      return item.hasRight(Models.AccessRights.Share);
    },
    canDeploy(item) {
      if(!item) return false
      return item.hasRight(Models.AccessRights.Deploy);
    },
    async deployItem(item) {
      this.loading = true;
      var result = await this.$store.dispatch('bpmn/deployProcess', item.id);
      if (result.success) {
        Notification.success(result.message || this.$t('bpmn.errors.ProcessDeployed'));
      } else {
        Notification.error(result.message || this.$t('bpmn.errors.ProcessNotDeployed'));
      }
      this.loading = false;
    },
  }
  
}
</script>
<style lang="scss" >
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
  margin: 0 10px;
}
.bpmn-diagram-container {
  width: 100%;
  height: 100%;
  grid-area: modeler;
  position: relative;
  top:2px
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
.options-panel {
  position: absolute;
  background-color: #f5f5f5;
  bottom: 12px;
  right: 30px;
  border: 1px solid #CCC;
  border-radius: 2px;
  z-index: 50;
  .v-btn {
    min-width: 45px !important
  }
}

</style>