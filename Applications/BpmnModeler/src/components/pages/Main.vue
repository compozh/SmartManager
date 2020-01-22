<template>
 <v-container align-center column >
    <v-row class="layout-title">
      <h1>{{$t('bpmn.labels.RecentlyActive')}}</h1>
      <h2>{{$t('bpmn.labels.LastChanged')}}</h2>
    </v-row>
    <v-divider />
      <v-row class="layout recent-diagrams">
        <v-col cols=4 v-for="item in items.slice(0, 3)" :key="item.id">
          <item-card :item="item" 
            @deployItem="deployItem"
            @exportItem="exportItem"/>
        </v-col>
      </v-row>
    <v-row class="layout-title py-0" justify="space-between">
      <h1>{{$t('bpmn.labels.Projects')}}</h1>
      <v-col cols="6" class="justify-end">
        <v-row class="align-center justify-end">
          <bpmn-contex-menu 
            @create="createItem"
            @edit="editItem" 
            @import="importItem">
            <template #activator="{ open }">
              <v-btn  class="text-left white--text blue" v-on="open" :title="$t('bpmn.buttons.AddElement')">
                {{$t('bpmn.buttons.Add')}}
              </v-btn>
            </template>
          </bpmn-contex-menu>
          <v-text-field 
            class="search col-6 py-2"
            clearable
            v-model="search"
            append-icon="search"
            :label="$t('bpmn.labels.Search')"
            single-line
            hide-details
          ></v-text-field>
        </v-row>
      </v-col>
    </v-row>
    <v-divider />
    <v-row>
      <v-data-table 
        
        :headers="headers"
        :items="items"
        :hide-default-footer="items.length < 11"
        :search="search"
        :footer-props="{
            itemsPerPageText: $t('bpmn.labels.PerPage'),
            itemsPerPageAllText: $t('bpmn.labels.All'),
            pageText : $t('bpmn.labels.Of') +' '+ items.length,
            showCurrentPage : true
          }"
        class="projects-table"
      >
        <template v-slot:header.name="{ header }">
          <span style="font-size: 16px;" >{{ header.text }}</span>
        </template>
        <!-- <template v-slot:header.actions="{ header }">
          <span style="max-width:10%" >{{ header.text }}</span>
        </template> -->
        <template v-slot:item.name="{ item }">
          <v-row style=" min-width: 60vw; cursor: pointer;" @click="openProject(item)">
            <v-icon v-if="item.isFolder" class="pr-2">folder</v-icon>
            <v-icon v-else class="pr-2">table</v-icon>
            {{ item.name }}
          </v-row>
        </template>
        <template v-slot:item.action="{ item }">
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
        </template>
      </v-data-table>
    </v-row>
 </v-container>
</template>
<script>
import { formMixin, importMixin, propertiesPanelEventsHandlersMixin } from '../mixins';
import { Folder, Diagram, DiagramType } from '../../api/models';
import * as Dialogs from '../dialogs';
import FormioContainer from '../formio/Formio';
import { Notification } from 'element-ui';
import { events } from '../../constants';
export default {
  name: 'bpmn-main',
  data () {
    return {
      search: '',
    }
  },
  components: { SelectionGrid: Dialogs.SelectionGrid, AccessDialog: Dialogs.AccessDialog, FormioContainer },
  mixins: [ formMixin, importMixin, propertiesPanelEventsHandlersMixin ],
  props: {
    items: Array,
  },
  created(){ console.log(this.items)},
  methods: {
    openProject(el) { 
      el.type == 'BPMN'? this.$router.push({name: 'Process', params: {id: el.id}}) 
        : el.type == 'DMN' ? this.$router.push({name: 'Decision', params: {id: el.id}})
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
  computed: {
    headers(){
      return [
        {text: this.$t('bpmn.labels.Name'), value: 'name'},
        {text: this.$t('bpmn.labels.Count'), value: 'items.length'},
        { text: '', value: 'action', sortable: false }
        ]
    },
  }
};
</script>
<style lang="scss" scoped>
.layout-title {
  padding: 20px;
  display: flex;
  align-items: center;
  h1{
    color: #535353;
    font-size: 22px;
    font-weight: 700;
    vertical-align: bottom;
  }
  h2{
    margin-left: 30px;
    color: #7d7d7d;
    font-size: 13px;
    font-weight: 400;
    line-height: 1.2;
  }
}
.projects-table {
  width: 100%;
  margin: 20px 10px;
  padding: 10px;
}
thead.v-data-table-header span{
  font-size: 16px
}
</style>
