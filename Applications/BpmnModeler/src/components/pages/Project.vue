<template>
  <v-container column fluid> 
    <v-row class="project-title py-0 " justify="space-between">
      <v-col cols="5" class="justify-start">
        <v-row class="align-center justify-start pt-4">
          <v-icon class="pr-2">mdi-folder-open</v-icon>
          <h1>{{item ? item.name : 'folder'}}</h1>
        </v-row>
      </v-col>
      <v-col cols="7" class="justify-end">
        <v-row class="align-center justify-end">
          <v-btn  class="text-left white--text blue add-btn mx-3" @click="addProcess()">
            {{ $t('bpmn.buttons.AddProcess') }}
          </v-btn>
          <v-btn  class="text-left white--text blue add-btn" @click="addFolder()">
            {{ $t('bpmn.buttons.AddFolder') }}
          </v-btn>
          <v-text-field 
            class="search col-3 py-2 pl-3" solo
            clearable
            v-model="search"
            append-icon="search"
            :label="$t('bpmn.labels.Search')"
            single-line
            hide-details
          ></v-text-field>
          <v-select
            class="search col-3 py-2 pl-3"
            :items="selectItems"
            :label="$t('bpmn.labels.SortBy')"
            solo
          >
            <template v-slot:item="{ item }" >
              <div class="select-item py-3" @click="checkSort(item.value)">{{ item.text }}</div>
            </template>
          </v-select>
        </v-row>
      </v-col>
    </v-row>
    <v-divider class="elevation-5"/>
    <template v-if="hasElements('folder').length > 0">
      <v-row class="layout-title pb-0 pt-7" justify="space-between">
        <h2>{{$t('bpmn.labels.Folders')}}</h2>
      </v-row>
      <v-divider class="elevation-5" />
      <v-row>
        <item-data-table :items="hasElements('folder')" :activeItem.sync="active"/>
      </v-row>
    </template>
    
    <template v-if="hasElements('diagram').length > 0">
      <v-row class="layout-title pb-0 pt-7" justify="space-between">
        <h2>{{$t('bpmn.labels.Diagrams')}}</h2>
      </v-row>
      <v-divider class="elevation-5" />
      <v-row class="layout diagrams" v-if="children && children.length > 0">
        <v-col cols=4 v-for="item in hasElements('diagram')" :key="item.id">
          <item-card :item="item" :activeItem.sync="active"/>
        </v-col>
      </v-row>
    </template>
    <v-row v-else-if="children.length == 0" class="empty" >
      <bpmn-empty />
    </v-row>
  </v-container>
</template>
<script>
import { Folder, Diagram } from '../../api/models';
import { formMixin, importMixin } from '../mixins';
export default {
  name: 'bpmn-project',
  mixins: [ formMixin, importMixin ],
  data: () => ({
    elements: [],
    search: '',
    sort: 'name',
    sortedIn: 'name'
  }),
  props: {
    activeItem: String
  },
  methods: {
    getChildren(children) {
      let sorted
      if (this.search) {
        children = children.filter(el => el.name.toLowerCase().includes(this.search.toLowerCase()))
      }
      if(this.sortedIn == this.sort){ 
        return children
      } else if ( this.sort == 'name') {
        sorted = children.sort(( a, b ) =>  a.name.localeCompare(b.name))
      } else if (this.sort ==  'items') {
        sorted = children.sort(( a, b ) => (a.items ? a.items.length : 0 ) - (b.items ? b.items.length : 0))
      } else  {
        this.sort = this.sortedIn
        sorted = children.reverse()
      }
      this.sortedIn = this.sort
      return sorted
    },
    checkSort(value) {
      if(this.sortedIn == value){
        this.sort = 'revert'
        this.sortedIn = value
      } else { 
        this.sort = value
      }
    },
    addFolder() {
      this.createItem(null, 'folder');
      this.$forceUpdate()
    },
    addProcess() {
      this.createItem(this.item, 'process');
    },
    hasElements(type) {
      if(!this.children) return []
      let elements = type == 'diagram'?
          this.children.filter( item => !item.isFolder)
        : this.children.filter( item => item.isFolder)
        console.log(elements)
      return elements
    },
  },
  computed: {
    selectItems(){
      return [{text: this.$t('bpmn.labels.Name'), value: 'name'},
              {text: this.$t('bpmn.labels.Count'), value: 'items'}]
    },
    item() {      
      let itemId = this.$route.params.id
      const { item, index } = this.$store.getters['bpmn/getItemById'](itemId)
      return item
    },
    children: {
      get: function(){
        if (!this.item) { return [] }
        let children = this.item.items
        children = this.getChildren(children)
        return children
      },
      set: function(val) {
        return val
      }
    },
    items() {
      return this.$store.state.bpmn.items;
    },
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
    },
  }
};
</script>
<style lang="scss" scoped>
.layout-title, .project-title {
  width: 100%;
  padding: 25px;
  display: flex;
  align-items: center;
} 
.layout-title {
  height: 80px;
}
 h1, h2 {
  width: calc(100% - 40px);
  text-align: start;
  color: #535353;
  font-size: 22px;
  font-weight: 700;
  vertical-align: bottom;
}
h2{
  font-size: 18px;
  font-weight: 600;
  vertical-align: bottom;
}

.empty {
  height: calc(100vh - 200px);
}
.add-btn {
  // width: 120px;
  height: 45px !important;
}
.search {
  max-height:66px;
}
.select-item {
  font-size: 16px; 
  width: 100%;
  height: 48px;
}
</style>
