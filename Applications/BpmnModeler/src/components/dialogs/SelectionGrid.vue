<template>
  <v-card>
    <v-card-title primary-title>
        <h4 class="headline mb-0">{{ title }}</h4>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          :label="$t('bpmn.labels.Search')"
          single-line
          hide-details
        ></v-text-field>
    </v-card-title>
    <v-card-text style="max-height: 500px; overflow-y: auto;">
       <v-data-table
        hide-actions      
        v-model="selected"
        :headers="columns"
        :items="items"
        :search="search"
        :pagination.sync="pagination"
        :loading="loading"
      >
        <template v-slot:headers="props">
          <tr>
            <th>
              <v-checkbox
                v-if="multi"
                :input-value="props.all"
                :indeterminate="props.indeterminate"
                primary
                hide-details
                @click.stop="toggleAll"
              ></v-checkbox>
              <div v-else></div>
            </th>
            <th
              v-for="header in props.headers"
              :key="header.text"
              :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
              @click="changeSort(header.value)"
            >
              <v-icon small>arrow_upward</v-icon>
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
      <v-btn flat @click="cancel()">{{ $t('bpmn.buttons.Cancel') }}</v-btn>
      <v-btn flat color="primary" :disabled="!selected.length || loading" @click="select()">{{ $t('bpmn.buttons.Select') }}</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import goTo from 'vuetify/lib/components/Vuetify/goTo'

export default {
  name: 'selection-grid',
  props: {
    multi: {
      type: Boolean,
      default() { return false }
    },
    columns: {
      type: Array,
      default() {
        return [ { text: this.$t('bpmn.labels.Name'), value: 'name' }, { text: this.$t('bpmn.labels.Id'), value: 'id' } ];
      }
    },
    items: {
      type: Array,
      required: true,
      default() { return [] }
    },
    selectedItems: {
      type: Array,
      default() { return [] }
    },
    loading: Boolean,
    title: String
  },
  data() {
    return {
      search: '',
      selected: [],
      pagination: {
        sortBy: 'name',
        rowsPerPage: -1
      }
    }
  },
  watch: {
    selectedItems(value) {
      this.selected = value;
    }
  },
  methods: {
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
      this.$emit('select', this.multi ? this.selected : this.selected[0]);
    },
    cancel() {
      this.$emit('cancel');
    },
    selectProp(props) {
      if (!this.multi) {
        this.selected = [];
      }
      this.$nextTick(() => {
        props.selected = !props.selected;
      });
    }
  }
}
</script>
<style>

</style>