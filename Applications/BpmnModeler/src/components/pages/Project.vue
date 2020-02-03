<template>
  <v-container column fluid px-6> 
    <v-row class="project-title py-0 " justify="space-between">
      <v-col cols="5" class="justify-start" >
        <v-row class="align-center justify-start">
          <v-icon class="pr-2">mdi-folder-open</v-icon>
          <h1>{{item ? item.name : 'folder'}}</h1>
        </v-row>
      </v-col>
      <v-col cols="7" class="justify-end" >
        <v-row class="align-center justify-end" :class="$vuetify.breakpoint.lgAndDown? 'text' : 'xl-text'">
          <!-- <v-btn  class="add-btn" @click="importItem(item)">
            {{ $t('bpmn.buttons.Import') }}
          </v-btn> -->
          <v-btn  class="add-btn mx-2" @click="addProcess()">
            {{ $t('bpmn.buttons.AddProcess') }}
          </v-btn>
          <v-btn  class="add-btn"  @click="addFolder()">
            {{ $t('bpmn.buttons.AddFolder') }}
          </v-btn>
          <v-text-field dense
            class="search col-3 py-2 pl-2" solo
            clearable
            v-model="search"
            append-icon="mdi-magnify"
            :label="$t('bpmn.labels.Search')"
            single-line
            hide-details
          ></v-text-field>
          <v-select dense bottom
            class="search col-3 py-2 pl-3"
            :items="selectItems"
            :label="$t('bpmn.labels.SortBy')"
            solo>
            <template v-slot:item="{ item }" >
              <div class="select-item py-3" @click="checkSort(item.value)">{{ item.text }}</div>
            </template>
          </v-select>
        </v-row>
      </v-col>
    </v-row>
    <v-divider />
    <template v-if="hasElements('folder').length > 0">
      <v-row class="layout-title pb-0 pt-2" justify="space-between">
        <h2>{{$t('bpmn.labels.Folders')}}</h2>
      </v-row>
      <v-row>
        <item-data-table :items="hasElements('folder')" :activeItem.sync="active"/>
      </v-row>
    </template>
    <v-divider />
    <template v-if="hasElements('diagram').length > 0">
      <v-row class="layout-title py-0 " justify="space-between">
        <h2>{{$t('bpmn.labels.Diagrams')}}</h2>
      </v-row>
      <!-- <v-divider class="elevation-3" /> -->
      <v-row class="layout diagrams py-0" v-if="children && children.length > 0">
        <v-col cols=3 v-for="item in hasElements('diagram')" :key="item.id" class="pa-2">
          <item-card :item="item" :activeItem.sync="active" :chosen.sync="chosen" @choosed="choosed"/>
        </v-col>
      </v-row>
    </template>
    <v-row v-else-if="children.length == 0" class="empty" >
      <bpmn-empty />
    </v-row>
    <folder-menu-footer  :item="item" :chosen.sync="chosen"/>
  </v-container>
</template>
<script>
import { formMixin, importMixin } from '../mixins';
import moment from 'moment'
export default {
  name: 'bpmn-project',
  mixins: [ formMixin, importMixin ],
  data: () => ({
    elements: [],
    search: '',
    sort: 'name',
    sortedIn: 'name',
    chosen: []
  }),
  props: {
    activeItem: String
  },
  methods: {
    choosed(val) {
      let elem = this.chosen.find( el => el.id == val.id)
      if (elem) {
        this.chosen = this.chosen.filter( el => el.id != val.id)
      } else {
        this.chosen.push(val)
        setTimeout(()=> this.$vuetify.goTo('.v-footer'), 0)
      }
    },
    getChildren(children) {
      let sorted
      if (this.search) {
        children = children.filter(el => el.name.toLowerCase().includes(this.search.toLowerCase()))
      }
      if (this.sortedIn == this.sort) { 
        return children
      } else if ( this.sort == 'name') {
        sorted = children.sort(( a, b ) =>  a.name.localeCompare(b.name))
      } else if (this.sort ==  'creationTime' || this.sort ==  'editTime' ) {
        sorted = children.sort(( a, b ) => {
          let first = !a[this.sort] ? a.creationTime : a[this.sort]
          let second = !b[this.sort] ? b.creationTime : b[this.sort]
          return moment(first).toDate().getTime() - moment(second).toDate().getTime()
        })
      } else  {
        this.sort = this.sortedIn
        sorted = children.reverse()
      }
      this.sortedIn = this.sort
      return sorted
    },
    checkSort(value) {
      if (this.sortedIn == value) {
        this.sort = 'revert'
        this.sortedIn = value
      } else { 
        this.sort = value
      }
    },
    addFolder() {
      this.createItem(this.item, 'folder');
    },
    addProcess() {
      this.createItem(this.item, 'process');
    },
    hasElements(type) {
      if (!this.children) { return [] }
      let elements = type == 'diagram' ?
        this.children.filter( item => !item.isFolder)
        : this.children.filter( item => item.isFolder)
      return elements
    },
  },
  computed: {
    selectItems() {
      return [{text: this.$t('bpmn.labels.Name'), value: 'name'},
        {text: this.$t('bpmn.labels.CreationTime'), value: 'creationTime'},
        {text: this.$t('bpmn.labels.EditTime'), value: 'editTime'}]
    },
    item() {      
      let itemId = this.$route.params.id
      const { item, index } = this.$store.getters['bpmn/getItemById'](itemId)
      return item
    },
    children: {
      get: function() {
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
  height: 60px;
}
 h1, h2 {
  width: calc(100% - 40px);
  text-align: start;
  color: #535353;
  font-size: 17px;
  font-weight: 700;
}
h2{
  font-size: 14px;
  font-weight: 600;
}

.empty {
  height: calc(100vh - 200px);
}
.add-btn {
  font-size: 11px;
  color: white;
  background-color: #1976d2 !important;
  height: 40px !important;
}
.search {
  max-height:55px;
}

.v-input.select-item .v-label {
  font-size: 11px !important; 
}
.select-item {
  width: 100%;
  height: 42px;
  text-align: start;
  font-size: 14px
}


.menu-btn {
  color: #535353;
  font-size: 11px;
}
</style>
<style lang="scss">
.text .add-btn{
  font-size: 0.6em
}
.text .v-label {
  font-size: 0.8em
}
.xl-text  {
  label {
    font-size: 0.76em
  }
}
</style>