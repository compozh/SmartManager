<template>
  <v-dialog v-if="show" v-model="show" max-width="800" @keydown.enter="select()" ref="dialog" class="selection-grid">
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
          hide-default-footer
          v-model="selected"
          :headers="headers"
          :items="items"
          :search="search"
          :options.sync="options"
          :no-data-text="$t('bpmn.labels.NoData')"
          :no-results-text="$t('bpmn.labels.NoData')"
          show-select
          single-select
        >
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="close">{{ $t('bpmn.buttons.Cancel') }}</v-btn>
        <v-btn text color="primary" :disabled="!selected.length" @click="select()">{{ $t('bpmn.buttons.Select') }}</v-btn>
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
      options: {
        sortBy: ['name'],
        rowsPerPage: -1
      }
    };
  },
  computed: {
    headers() {
      return [ { text: this.$t('bpmn.labels.Name'), value: 'name' }, { text: this.$t('bpmn.labels.Id'), value: 'id' } ];
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
      this.selected = selectedItem ? [selectedItem] : [];
      this.callback = callback;
      this.show = true;
    },
    close() {
      this.show = false;
      let overlays = document.querySelectorAll('.v-overlay');
      overlays.forEach(el => el.parentNode.removeChild(el));
    },
    select() {
      if (!this.selected.length) {
        return;
      }
      if (this.callback) {
        this.callback(this.selected[0]);
        this.callback = null;
      }
      this.close();
    }
  }
};
</script>
<style>

</style>