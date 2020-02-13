<template>
	<v-container class="column pa-0 fill-height" fluid >
    <Split  @onDragEnd="onSplitDragEnd" :gutterSize="12">
      <SplitArea :size="100 - splitSize" class="diagram-section">
          <bpmn-modeler v-if="type == 'BPMN'" :onlyRead="true"/>
          <dmn-modeler v-else :onlyRead="true"/>
      </SplitArea>
      <SplitArea :size="splitSize" :minSize="0" class="properties-panel-section">
        <div class="properties-panel-container" >
          <v-toolbar dense height="40" flat class="modeler-toolbar elevation-1 ">
            {{$t('bpmn.labels.Milestones')}}
          </v-toolbar>
          <v-list two-line>
            <v-list-item class="row d-flex" >
              <v-list-item-avatar class="ma-0">
                <v-icon>mdi-pencil</v-icon>
              </v-list-item-avatar>
              <v-list-item-content style="text-align: start" class="px-2 py-2">
                <v-list-item-title> name of version</v-list-item-title>
                <v-list-item-subtitle> time  & created by who</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action class="ma-0">
                <!-- <bpmn-contex-menu :item="$route.params.id"
                    offset>
                  <template #activator="{ open }"> -->
                    <v-btn icon >
                      <v-icon color="grey lighten-1">mdi-dots-vertical</v-icon>
                    </v-btn>
                <!-- </template>
              </bpmn-contex-menu> -->
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </div>
      </SplitArea>
    </Split>
	</v-container>
</template>

<script>

import 'diagram-js-minimap/assets/diagram-js-minimap.css';
import moment from 'moment';
import { events } from '../../constants';
import { CancellationToken, editorFactory } from '../../api';
import { Diagram, DiagramType, AccessRights } from '../../api/models';
import { eventBus } from '../../main';
import { editorToolbarMixin } from '../mixins';
import { debounce } from 'throttle-debounce';
export default {
  name: 'bpmn-milestones',
  data () {
    return {
      loading: false,
      split: null,
    };
  },
  computed: {
    type() {
      const activeItem = this.$store.state.bpmn.activeItem;
      if (activeItem && activeItem instanceof Diagram) {
        return activeItem.type;
      }
      return null;
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
  },
  methods: {
    onSplitDragEnd(size) {
      this.splitSize = 100 - Number.parseInt(size);
    },
   
  },
};
</script>
<style lang="scss" scoped>
.diagram-section {
  width: 100%;
  height: 100%;
  grid-area: modeler;
  position: relative;
  top:2px;
  overflow: hidden;
}
.properties-panel-section {
  
  height: 100%;
  position: relative;
  overflow: hidden;
}
.bpmn-diagram-container {
  max-width: 100%;
  max-height: 100%;
  position: relative;
  top:2px;
  overflow: hidden;
}
.split {
  overflow: hidden;
}
.modeler-toolbar {
  padding-left: 10px;
  align-items: center;
  justify-content: start;
  display: flex;
}
</style>