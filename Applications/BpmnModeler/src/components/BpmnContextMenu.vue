<template>
  <v-menu close-on-click
          close-on-content-click
          :offset-x="offset"
          offset-y>
    <template v-slot:activator="{ on }">
      <slot name="activator" :open="on"></slot>
    </template>
    <v-list>
      <template v-if="!item || item.isFolder">
        <v-list-tile @click="addFolder(item)">
          <v-list-tile-avatar>
            <v-icon>mdi-folder</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-title>{{ $t('bpmn.buttons.AddFolder') }}</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="addProcess(item)">
          <v-list-tile-avatar>
            <v-icon>mdi-file-tree</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-title>{{ $t('bpmn.buttons.AddProcess') }}</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="importBpmn(item)">
          <v-list-tile-avatar>
            <v-icon>mdi-import</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-title>{{ $t('bpmn.buttons.Import') }}</v-list-tile-title>
        </v-list-tile>
      </template>
      <template v-else-if="item.type === 'BPMN'">
        <v-list-tile @click="exportBpmn(item)">
          <v-list-tile-avatar>
            <v-icon>mdi-file-code</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-title>{{ $t('bpmn.buttons.ExportBpmn') }}</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="exportSvg(item)">
          <v-list-tile-avatar>
            <v-icon>mdi-file-image</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-title>{{ $t('bpmn.buttons.ExportSvg') }}</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="deploy(item)">
          <v-list-tile-avatar>
            <v-icon>save_alt</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-title>{{ $t('bpmn.buttons.Deploy') }}</v-list-tile-title>
        </v-list-tile>
      </template>
      <template v-else-if="item.type === 'DMN'">
        <v-list-tile @click="exportDmn(item)">
          <v-list-tile-avatar>
            <v-icon>save_alt</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-title>{{ $t('bpmn.buttons.ExportDmn') }}</v-list-tile-title>
        </v-list-tile>
      </template>
      <template v-if="item">
        <v-divider></v-divider>
        <v-list-tile @click="edit(item)">
          <v-list-tile-avatar>
            <v-icon>edit</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-title>{{ $t('bpmn.buttons.Rename') }}</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="remove(item)">
          <v-list-tile-avatar>
            <v-icon>delete</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-title>{{ $t('bpmn.buttons.Delete') }}</v-list-tile-title>
        </v-list-tile>
      </template>
    </v-list>
  </v-menu>
</template>
<script>
export default {
  name: 'bpmn-contex-menu',
  props: {
    item: Object,
    offset: Boolean
  },
  methods: {
    addFolder(item) {
      this.$emit('create', item, 'folder');
    },
    addProcess(item) {
      this.$emit('create', item, 'process');
    },
    edit(item) {
      this.$emit('edit', item);
    },
    remove(item) {
      this.$emit('remove', item);
    },
    importBpmn(item) {
      this.$emit('import', item);
    },
    exportBpmn(item) {
      this.$emit('export', item, 'bpmn');
    },
    exportDmn(item) {
      this.$emit('export', item, 'dmn');
    },
    exportSvg(item) {
      this.$emit('export', item, 'svg');
    },
    deploy(item) {
      this.$emit('deploy', item);
    }
  },
}
</script>
<style>

</style>