<template>
 <v-container align-center column >
    <v-row class="layout-title">
      <h1>{{$t('bpmn.labels.RecentlyActive')}}</h1>
      <h4>{{$t('bpmn.labels.LastChanged')}}</h4>
    </v-row>
    <v-divider />
      <v-row class="layout recent-diagrams">
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
              <v-btn  class="text-left blue--text text--darken-2" v-on="open" :title="$t('bpmn.buttons.AddElement')">
                {{$t('bpmn.buttons.Add')}}
              </v-btn>
            </template>
          </bpmn-contex-menu>
          <v-text-field 
            class="search col-6"
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
        @click:row="openProject"
        :headers="headers"
        :items="items"
        :hide-default-footer="items.length < 11"
        :search="search"
        class="projects-table"
      >
       <template v-slot:item.name="{ item }">
        <v-icon v-if="item.isFolder" class="pr-2">folder</v-icon>
        <v-icon v-else class="pr-2">table</v-icon>
        {{ item.name }}
      </template>
      </v-data-table>
    </v-row>
 </v-container>
</template>
<script>
// import { eventBus } from '../main';
// import { events } from '../constants';
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
  methods: {
    openProject(el) {
      debugger
      this.$router.push({name: 'Project', params: {id: el.id}, props: {item: el}})  
    }
  },
  props: {
    items: Array,
    // activeItem: String
  },
  computed: {
    // folders() {
    //   if(!this.items.length){
    //     return
    //   }
    //   console.log(this.items)
    //   return this.items.filter( el => el.isFolder)
    // },
    headers(){
      console.log(this)
      return [{text: 'name', value: 'name'}, {text: 'num of', value: 'items.length'}]
    },
  }
};
</script>
<style lang="scss" scoped>
.layout-title {
  padding: 25px;
  display: flex;
  align-items: center;
  h1{

    color: #535353;
    font-size: 22px;
    font-weight: 700;
    vertical-align: bottom;
  }
  h4{
    margin-left: 30px;
    color: #7d7d7d;
    font-size: 13px;
    font-weight: 400;
    line-height: 1.2;
  }
}
.recent-diagrams {
  height: 200px;
}
.projects-table {
  width: 100%;
  margin: 20px 10px;
  padding: 10px;
}
</style>
