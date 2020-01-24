<template>
  <v-card class="item-card pa-2" @click="openProject(item)" elevation="5">
    <v-card-title class="justify-space-between py-2 px-0">
      <bpmn-tree-icon :node="item"></bpmn-tree-icon>
      <h1 class="pl-2" :title="item.name">{{item.name}}</h1>
    </v-card-title>
    <v-card-text v-if="!item.isFolder" style="height: 200px; border: 1px solid silver">
      <!-- {{exportItem(item)}} -->
    </v-card-text>
  </v-card>
</template>

<script>
import { formMixin, importMixin, propertiesPanelEventsHandlersMixin } from '../mixins';
import { Folder, Diagram, DiagramType } from '../../api/models';
import { events } from '../../constants';
import { eventBus } from '../../main';
import BpmnTreeIcon from '../functional/BpmnTreeIcon'
export default {
  name: 'item-card',
  props: {
    item: Object,
    activeItem: String
  },
  methods: {
    // exportItem(item) {
    //   console.log(eventBus.$emit(events.modeler.export, 'svg'))
    //  return eventBus.$emit(events.modeler.export, 'svg');
    // },
    openProject(el) { 
      this.active = el
    },
  },
  computed: {
    active: {
     get() {
        return this.activeItem;
      },
      set(value) {
        if (value === this.activeItem) {
          return;
        }
        this.$emit('update:activeItem', value);
      }
    }
  }
};
</script>
<style lang="scss" scoped>

.v-card__title{
  cursor: pointer;
  width: calc(100% - 30px);
}

h1 {
  color: #535353;
  font-size: 22px;
  font-weight: 700;
  vertical-align: bottom;
  text-align: start;
  height: 32px;
  width: calc(100% - 30px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

</style>