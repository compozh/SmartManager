<template>
  <v-layout column class="external-elements">
    <v-layout row class="header">
      <v-subheader>{{ label }}</v-subheader>
      <v-spacer></v-spacer>
      <v-btn v-if="canCreate && !readonly" icon small :title="$t('bpmn.buttons.Add')" @click="createElement()">
        <v-icon>add</v-icon>
      </v-btn>
    </v-layout>
    <v-card class="tree-container">
      <el-tree
        ref="tree"
        class="tree"
        :data="fields" 
        highlight-current
        node-key="id"
        empty-text=""
        @current-change="(item) => active = item">
        <template v-slot="{ data: field }">
          <span class="treeview-node-content">
            <span class="treeview-node-label">{{ field.label || field.id }}</span>
            <v-btn v-if="canRemove && !readonly" flat icon :title="$t('bpmn.buttons.Delete')" @click="removeElement(field)"><v-icon>close</v-icon></v-btn>
          </span>
        </template>
      </el-tree>
    </v-card>
  </v-layout>
</template>
<script>
export default {
  name: 'properties-panel-extension-elements',
  props: {
    label: {
      type: String,
      required: true
    },
    element: Object,
    createExtensionElement: Function,
    removeExtensionElement: Function,
    onActiveElementChanged: Function,
    getExtensionElements: {
      type: Function,
      required: true
    },
    readonly: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      activeElement: null,
    }
  },
  computed: {
    canCreate() {
      return typeof this.createExtensionElement === 'function';
    },
    canRemove() {
      return typeof this.removeExtensionElement === 'function';
    },
    active: {
      get() {
        return this.activeElement;
      },
      set(value) {
        this.activeElement = value;
        this.$emit('update:activeElement', value);
        this.onActiveElementChanged(value);
      }
    },
    fields() {
      return this.getExtensionElements();
    }
  },
  watch: {
    onActiveElementChanged: {
      immediate: true,
      handler() {
        this.onActiveElementChanged(this.active);
      }
    },
    element(value, newValue) {
      if (value !== newValue) {
        this.active = undefined;
      }
    }
  },
  methods: {
    createElement() {
      this.createExtensionElement();
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(this.fields[this.fields.length - 1].id);
        var container = this.$el.querySelector('.external-elements > .tree-container');
        container.scrollTop = container.scrollHeight;
      })
      
    },
    removeElement(element) {
      this.removeExtensionElement(element);
      this.$nextTick(() => this.$refs.tree.setCurrentKey());
    }
  }
}

</script>
<style>
.external-elements {
  padding-bottom: 20px;
}

.external-elements > .header > .v-subheader {
  padding: 0;
  height: 24px;
  font-size: 12px;
  font-weight: 400;
}
.external-elements > .header > .v-btn {
  margin: 0 6px;
}
.external-elements > .tree-container {
  height: 131px; 
  overflow: auto;
}
.external-elements > .tree-container > .tree .treeview-node-content {
  padding-left: 6px;
}
.external-elements > .tree-container > .tree .el-tree-node__expand-icon{
  display: none;
}
.external-elements > .tree-container > .tree .el-tree-node.is-current > .el-tree-node__content {
  background: rgba(0,0,0,.12);
}
</style>