<template>
  <v-col class="fill-height">
    <v-text-field
      v-model="search"
      :label="$tc('bpmn.labels.Search')"
      class="tree-search"
      hide-details
      clearable
      single-line
    ></v-text-field>
    <el-tree ref="treeView"
      class="models-tree-view"
      :data.sync="items"
      :props="treeProps"
      node-key="id"
      draggable
      highlight-current
      empty-text=""
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      :allow-drag="allowDrag"
      :allow-drop="allowDrop"
      @current-change="onCurrentChanged"
      @node-drop="onNodeDrop">
      <template v-slot="{ node, data }">
        <span class="treeview-node-content">
          <bpmn-tree-icon :node="node"></bpmn-tree-icon>
          <span class="treeview-node-label" :title="node.label">{{ node.label }}</span>
          <v-icon v-if="data.isSystem" :title="$t('bpmn.labels.SystemRecord')">mdi-lock</v-icon>
          <slot name="context-menu" :item="data"></slot>
        </span>
      </template>
    </el-tree>
  </v-col>
</template>
<script>
import treeSearch from '../api/treeSearch';
import BpmnTreeIcon from './functional/BpmnTreeIcon'
import Folder from '../api/models/Folder';

export default {
  name: 'bpmn-tree',
  components: { BpmnTreeIcon },
  props: {
    items: Array,
    activeItem: String
  },
  data() {
    return {
      opened: [],
      search: '',
      treeProps: {
        label: 'name',
        children: 'items',
        isLeaf: (item) => !(item instanceof Folder)
      }
    };
  },
  methods: {
    setActiveItem(item) {
      this.$refs.treeView.setCurrentKey(item);
      this.openAllParents(item);
    },
    openAllParents(item) {
      let [{ item: { id: parentId = null } = {} } = {}] = treeSearch(this.items, e => e.isFolder && e.items.find(i => i.id === item));
      while (parentId) {
        this.$refs.treeView.getNode(parentId).expanded = true;
        ([{ item: { id: parentId = null } = {} } = {}] = treeSearch(this.items, e => e.isFolder && e.items.find(i => i.id === parentId)));
      }
    },
    onCurrentChanged(item, node) {
      this.active = item.id;
    },
    filterNode(value, data) {
      if (!value) {
        return true;
      }
      return data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    },
    allowDrag(draggingNode) {
      return true;
    },
    allowDrop(draggingNode, dropNode, type) {
      if (type === 'inner') {
        return dropNode.data.isFolder && (!draggingNode.data.isSystem || dropNode.data.isSystem);
      } else {
        return draggingNode.parent !== dropNode.parent && (!draggingNode.data.isSystem || (!(dropNode.parent.data instanceof Folder) || dropNode.parent.data.isSystem));
      }
    },
    onNodeDrop(draggingNode, dropNode, type, event) {
      this.$emit('drop', draggingNode.data, dropNode.data, type);
    }
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
    }
  },
  watch: {
    search(value) {
      this.$refs.treeView.filter(value);
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
  margin: 0px 18px 6px 18px;
  padding-top: 5px;
}
.treeview-node-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}
.treeview-node-content {
  width: 0;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  padding-right: 6px;
}
.treeview-node-content  i {
  font-size: 18px;
}
.treeview-node-content > i {
  margin-right: 6px;
}
.models-tree-view.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
  background: rgba(0,0,0,.12);
}
.treeview-node-content .v-btn {
  width: 28px;
  height: 28px;
  margin: 0;
}
</style>
