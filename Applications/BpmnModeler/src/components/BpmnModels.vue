<template>
  <v-treeview v-model="tree"
              :open="open"
              :items="items"
              activatable
              item-key="name"
              open-on-click>
    <template v-slot:prepend="{ item, open }">
      <v-icon v-if="item.isFolder">
        {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
      </v-icon>
    </template>
    <template v-slot:append="{ item }">
      <v-menu close-on-click
              close-on-content-click
              offset-x
              offset-y>
        <template v-slot:activator="{ on }">
          <v-btn class="ma-2" text v-on="on">
            <v-icon>list</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>rename-box</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ $tc('Rename') }}</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>delete</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ $tc('Delete') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-treeview>
</template>
<script>
export default {
  name: 'bpmn-models',
  data: function data() {
    return {
      open: [],
      tree: [],
      items: []
    }
  },
}
</script>
<style>

</style>
