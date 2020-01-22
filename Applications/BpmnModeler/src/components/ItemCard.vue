<template>
  <v-card class="item-card pa-2">
    <v-card-title class="justify-space-between py-2 px-0">
      <v-col @click="openProject(item)" class="card-title py-0 col-11">
        <v-row >
          <bpmn-tree-icon :node="item"></bpmn-tree-icon>
          <h1 class="pl-2" :title="item.name">{{item.name}}</h1>
        </v-row>
      </v-col>
      <v-col class="justify-end pa-0 card-actions">
        <bpmn-contex-menu :item="item"
          @create="createItem"
          @edit="editItem" 
          @remove="removeItem" 
          @import="importItem"
          @export="exportItem"
          @deploy="deployItem"
          @copy="copyItem"
          offset>
          <template #activator="{ open }">
            <v-btn icon class="text-left "  v-on="open">
              <v-icon>more_vert</v-icon>
            </v-btn>
          </template>
        </bpmn-contex-menu>
      </v-col>
    </v-card-title>
    <v-card-text v-if="!item.isFolder" @click="openProject(item)" style="height: 200px; border: 1px solid silver"></v-card-text>
  </v-card>
</template>

<script>
// import { eventBus } from '../main';
// import { events } from '../constants';
import { formMixin, importMixin, propertiesPanelEventsHandlersMixin } from './mixins';
import { Folder, Diagram, DiagramType } from '../api/models';
import * as Dialogs from './dialogs';
import FormioContainer from './formio/Formio';
import { Notification } from 'element-ui';
import { eventBus } from '../main';
import { events } from '../constants';
import auth from '@it-enterprise/jwtauthentication';
import BpmnTreeIcon from './functional/BpmnTreeIcon'
export default {
  name: 'item-card',
  
  components: { BpmnTreeIcon,SelectionGrid: Dialogs.SelectionGrid, AccessDialog: Dialogs.AccessDialog, FormioContainer },
  mixins: [ formMixin, importMixin, propertiesPanelEventsHandlersMixin ],
  props: {
    item: Object,
  },
  methods: {
    openProject(el) { 
      el.type == 'BPMN'? this.$router.push({name: 'Process', params: {id: el.id}}) 
        : el.type == '"DMN"' ? this.$router.push({name: 'Decision', params: {id: el.id}})
        : this.$router.push({name: 'Project', params: {id: el.id}}) 
      this.$forceUpdate()
    },
    exportItem() {
      this.$emit('exportItem')
    },
    deployItem(){
      this.$emit('deployItem')
    }
  },
};
</script>
<style lang="scss" scoped>

.card-actions {
  
  width:  30px;
}
.card-title{
  cursor: pointer;
  width: calc(100% - 30px);
}
h2{
  margin-left: 30px;
  color: #7d7d7d;
  font-size: 13px;
  font-weight: 400;
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