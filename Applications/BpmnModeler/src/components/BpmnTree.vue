<template>
  <v-layout column fill-height>
    <v-text-field
      v-model="search"
      :label="$tc('bpmn.labels.Search')"
      class="tree-search"
      hide-details
      clearable
      single-line
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
        <v-icon >
          {{ item.isFolder ? open ? 'mdi-folder-open' : 'mdi-folder' : 'mdi-file-tree' }}
        </v-icon>
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
  overflow: auto;
  height: 100%;
}
.tree-search {
  margin: 0px 15px 6px 25px;
  padding-top: 5px;
}
.v-treeview-node__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}
.v-treeview-node__content {
  flex-shrink: unset;
  width: 0;
}
@media only screen and (min-width: 960px) {
  .models-tree-view i {
    font-size: 18px;
  }
  .models-tree-view .v-treeview-node__label {
    font-size: 16px;
  }
  .models-tree-view .v-btn {
    width: 28px;
    height: 28px;
    margin: 0;
  }
  .v-treeview-node {
    margin-left: 18px;
  }
  .v-treeview-node--leaf {
    margin-left: 36px;
  }
  .v-treeview>.v-treeview-node--leaf {
    margin-left: 18px;
  }
  .tree-search {
    margin: 0px 18px 6px 18px;
  }
}
</style>
