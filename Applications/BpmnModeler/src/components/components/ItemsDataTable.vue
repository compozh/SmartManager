<template>
  <v-row class="px-3">
    <v-data-table
      @click:row="openProject"
      calculate-widths
      :headers="headers"
      :items="rows"
      :hide-default-footer="items.length < 11"
      :search="search"
      :no-data-text="$t('bpmn.labels.NoDataText')"
      :footer-props="{
          itemsPerPageText: $t('bpmn.labels.PerPage'),
          itemsPerPageAllText: $t('bpmn.labels.All'),
          pageText : $t('bpmn.labels.Of') +' '+ items.length,
          showCurrentPage : true
        }"
      class="projects-table elevation-5"
    >
      <template v-slot:header.name="{ header }" >
        <span style="font-size: 16px;" >{{ header.text }}</span>
      </template>
      <template v-slot:header.items.length="{ header }" >
        <div style="font-size: 16px; max-width: 150px" >{{ header.text }}</div>
      </template>
      <template v-slot:item.name="{ item }">
        <v-row style="width: 25vw; cursor: pointer;" >
          <bpmn-tree-icon :node="item"></bpmn-tree-icon>
          <span style="width: calc(100% - 35px);">{{ item.name }}</span>
        </v-row>
      </template>
      <template v-slot:item.creationTime="{ item }">
        {{item.creationTime | formatDate}}
      </template>
      <template v-slot:item.editTime="{ item }">
        {{item.editTime | formatDate}}
      </template> 
    </v-data-table>
  </v-row>
</template>

<script>
import moment from 'moment'
export default {
  name: 'item-data-table',
  data() {
    return {
      users: []
    }
  },
  props: {
    items: Array,
    activeItem: String,
    search: String,
  },
  filters: {
    formatDate(value) {
      if (value) {
        return moment(value).format('DD.MM.YYYY HH:mm:ss')
      }
    },
  },
  methods: {
    
    openProject(el) { 
      this.active = el
    },
    async loadUsers() {
      this.users = await this.$store.dispatch('bpmn/queryUsers')
    },
    findUser(userId) {
      if (this.users.length == 0) { return userId }
      let user = this.users.find( user => user.id == userId ),
        result = user ? user.name : userId
      return result
    }
  },
  computed: {
    rows() {
      let rows = this.items.map(item => {
        item.editorId = this.findUser(item.editorId)
        item.ownerId = this.findUser(item.ownerId)
        return item
      })
      return rows
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
    headers() {
      return [
        {text: this.$t('bpmn.labels.Name'), value: 'name'},
        {text: this.$t('bpmn.labels.CreationTime'), value: 'creationTime'},
        {text: this.$t('bpmn.labels.EditTime'), value: 'editTime'},
        {text: this.$t('bpmn.labels.Editor'), value: 'editorId'},
        {text: this.$t('bpmn.labels.Owner'), value: 'ownerId'},
        {text: this.$t('bpmn.labels.Count'), value: 'items.length'}]
    },
  },
  created() {
    this.loadUsers()
  }
};
</script>
<style lang="scss" >
.projects-table {
  width: 100%;
  margin: 20px 10px;
  padding: 10px;
  tr {
    cursor: pointer;
    td {
      font-size: 12px;
      padding: 0 10px;
      .v-icon {
        padding-right: 8px 
      
      }
    }
  }
}
thead.v-data-table-header span{
  font-size: 14px
}
</style>