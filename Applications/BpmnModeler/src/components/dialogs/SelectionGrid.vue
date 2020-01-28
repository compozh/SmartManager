<template>
  <v-dialog v-if="show" v-model="show" max-width="800">
    <v-card>
      <v-card-title primary-title>
        <h4 class="headline mb-0">{{ title }}</h4>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          prepend-icon="mdi-magnify"
          :label="$t('bpmn.labels.Search')"
          single-line
          hide-details
          clearable
        ></v-text-field>
      </v-card-title>
      <v-card-text style="height: 500px; overflow-y: auto;">
        <v-data-table
          hide-actions      
          v-model="selected"
          :headers="columns"
          :items="items"
          :search="search"
          :pagination.sync="pagination"
          :no-data-text="$t('bpmn.labels.NoData')"
          :no-results-text="$t('bpmn.labels.NoData')"
        >
          <template v-slot:headers="props">
            <tr>
              <th>
                <div></div>
              </th>
              <th
                v-for="header in props.headers"
                :key="header.text"
                :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                @click="changeSort(header.value)"
              >
                <v-icon small>mdi-arrow-up</v-icon>
                {{ header.text }}
              </th>
            </tr>
          </template>
          <template v-slot:items="props">
            <tr :active="props.selected" @click="selectProp(props)">
              <td>
                <v-checkbox
                  :input-value="props.selected"
                  @input="selectProp(props)"
                  primary
                  hide-details
                ></v-checkbox>
              </td>
              <td class="text-xs-left">{{ props.item.name }}</td>
              <td class="text-xs-left">{{ props.item.id }}</td>
            </tr>
            
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat @click="show = false">{{ $t('bpmn.buttons.Cancel') }}</v-btn>
        <v-btn flat color="primary" :disabled="!selected.length" @click="select()">{{ $t('bpmn.buttons.Select') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { eventBus } from '../../main';
import { events } from '../../constants';

export default {
  name: 'selection-grid',
  data() {
    return {
      show: false,
      search: '',
      title: '',
      items: [],
      selected: [],
      pagination: {
        sortBy: 'name',
        rowsPerPage: -1
      },
      columns: [ { text: this.$t('bpmn.labels.Name'), value: 'name' }, { text: this.$t('bpmn.labels.Id'), value: 'id' } ]
    }
  },
  mounted() {
    eventBus.$on(events.modeler.showSelectionGrid, this.onShowSelectionGrid);
  },
  beforeDestroy() {
    eventBus.$off(events.modeler.showSelectionGrid, this.onShowSelectionGrid);
  },
  watch: {
    selectedItems(value) {
      this.selected = value;
    }
  },
  methods: {
    onShowSelectionGrid(title, items, selectedItem, callback) {
      this.title = title;
      this.items = items;
      this.selected = [selectedItem];
      this.callback = callback;
      this.show = true;
    },
    toggleAll () {
      if (this.selected.length) { 
        this.selected = [];
      } else {
        this.selected = this.desserts.slice();
      }
    },
    changeSort (column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
    },
    select() {
      if (!this.selected.length) {
        return;
      }
      if (this.callback) {
        this.callback(this.selected[0]);
        this.callback = null;
      }
      this.show = false;
    },
    selectProp(props) {
      this.selected = [];
      this.$nextTick(() => {
        props.selected = !props.selected;
      });
    }
  }
}
</script>
<style>

</style>