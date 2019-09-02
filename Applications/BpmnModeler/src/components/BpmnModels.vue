<template>
  <v-layout column>
    <v-text-field
      v-model="search"
      :label="$tc('Search')"
      class="tree-search"
      hide-details
      clearable
    ></v-text-field>
    <v-treeview :open.sync="open"
            :items="models"
            :active.sync="activeModel"
            :search="search"
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
        <v-menu close-on-click
                close-on-content-click
                offset-x
                offset-y>
          <template v-slot:activator="{ on }">
            <v-btn flat icon v-on="on">
              <v-icon>list</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-tile @click="rename(item)">
              <v-list-tile-avatar>
                <v-icon>edit</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-title>{{ $tc('Rename') }}</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="remove(item)">
              <v-list-tile-avatar>
                <v-icon>delete</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-title>{{ $tc('Delete') }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </template>
    </v-treeview>
  </v-layout>
</template>
<script>
export default {
  name: 'bpmn-models',
  data() {
    return {
      open: [],
      active: [ this.$store.state.bpmn.activeModel.id ],
      search: ''
    };
  },
  created() {
    const id = this.$route.params.id;
    if (id) {
      this.setActiveItem(id);
    }
  },
  methods: {
    setActiveItem(id) {
      if (id) {
        this.active.length = 0;
        this.active.push(id);
      }
    },
    rename(item) {
      this.$emit('rename', item);
    },
    remove(item) {
      this.$emit('remove', item);
    }
  },
  computed: {
    models() {
      return this.$store.state.bpmn.models;
    },
    activeModel: {
      get() {
        return this.active;
      },
      set(value) {
        if (value.length === 0) {
          this.setActiveItem(this.active[0]);
          return;
        }

        if (value[0] === this.active[0]) {
          return;
        }
        this.active = value;
        this.$router.push({ path: `/bpmnmodeler/model/${value}` });
      }
    },
  }
};
</script>
<style>
.models-tree-view {
  text-align: left;
  height: 100%;
}
.tree-search {
  margin: 0px 15px 6px 25px;
}
</style>
