<template>
  <v-layout column>
    <v-text-field
      v-model="search"
      :label="$tc('bpmn.labels.Search')"
      class="tree-search"
      hide-details
      clearable
    ></v-text-field>
    <v-treeview :open.sync="opened"
      :items="items"
      :active.sync="active"
      :search="search"
      item-children="items"
      activatable
      hoverable
      class="models-tree-view">
      <template v-slot:prepend="{ item, open }">
        <v-icon v-if="item.isFolder">
          {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
        </v-icon>
        <v-icon v-else>mdi-file-tree</v-icon>
      </template>
      <template v-slot:append="{ item }">
        <slot name="context-menu" :item="item"></slot>
      </template>
    </v-treeview>
  </v-layout>
</template>
<script>
import treeSearch from '../api/treeSearch';

export default {
  name: 'bpmn-tree',
  props: {
    items: Array,
    activeItem: String
  },
  data() {
    return {
      opened: [],
      search: ''
    };
  },
  methods: {
    setActiveItem(id) {
      if (id) {
        this.active.length = 0;
        this.active.push(id);
      }
    },
    openAllParents(item) {
      let [{ item: { parentId = null } = {} } = {}] = treeSearch(this.items, e => e.id === item);
      while (parentId) {
        if (!this.opened.includes(parentId)) {
          this.opened.push(parentId);
        }
        ([{ item: { parentId = null } = {} } = {}] = treeSearch(this.items, e => e.id === parentId));
      }
    }
  },
  computed: {
    active: {
      get() {
        if (this.activeItem) {
          return [ this.activeItem ];
        } else {
          return [];
        }
      },
      set(value) {
        const item = value.length ? value[0] : null;
        if (!item && this.activeItem) {
          this.active = [ this.activeItem ];
          return;
        }
        if (item) {
          this.openAllParents(item);
        }
        if (item === this.activeItem) {
          return;
        }
        this.$emit('update:activeItem', item);
      }
    }
  }
};
</script>
<style>
.models-tree-view {
  text-align: left;
  height: 100%;
}
.tree-search {
  margin: 5px 15px 6px 25px;
}
.v-treeview-node__label {
  max-width: 275px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
