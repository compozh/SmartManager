<template>
  <v-row class="px-3">
    <v-data-table
      @click:row="openProject"
      :headers="headers"
      :items="items"
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
      <template v-slot:header.name="{ header }" :on="{click: s}">
        <span style="font-size: 16px;" >{{ header.text }}</span>
      </template>
      <!-- <template v-slot:header.actions="{ header }">
        <span style="max-width:10%" >{{ header.text }}</span>
      </template> -->
      <template v-slot:item.name="{ item }">
        <v-row style=" min-width: 60vw; cursor: pointer;" >
          <v-icon v-if="item.isFolder" class="pr-2">mdi-folder</v-icon>
          <v-icon v-else-if="item.type == 'BPMN'" class="pr-2">mdi-file-tree</v-icon>
          <v-icon v-else class="pr-2">mdi-table</v-icon>
          {{ item.name }}
        </v-row>
      </template>

    </v-data-table>
  </v-row>
</template>

<script>
import BpmnTreeIcon from '../functional/BpmnTreeIcon'
export default {
  name: 'item-data-table',
  props: {
    items: Array,
    activeItem: String,
    search: String
  },
  methods: {
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
    }, 
    headers() {
      return [
        {text: this.$t('bpmn.labels.Name'), value: 'name'},
        {text: this.$t('bpmn.labels.Count'), value: 'items.length'}
      ]
    },
  }
};
</script>
<style lang="scss" scoped>
.projects-table {
  width: 100%;
  margin: 20px 10px;
  padding: 10px;
}
thead.v-data-table-header span{
  font-size: 16px
}

</style>