<template>
  <v-menu close-on-click
          close-on-content-click
          :offset-x="offset"
          offset-y>
    <template v-slot:activator="{ on }">
      <slot name="activator" :open="on"></slot>
    </template>
    <v-list>
      <template v-if="!item || isFolder(item)">
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
      <template v-else-if="isBpmn(item)">
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
        <v-list-tile @click="exportPng(item)">
          <v-list-tile-avatar>
            <v-icon>mdi-file-image-outline</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-title>{{ $t('bpmn.buttons.ExportPng') }}</v-list-tile-title>
        </v-list-tile>
      </template>
      <template v-else-if="isDmn(item)">
        <v-list-tile @click="exportDmn(item)">
          <v-list-tile-avatar>
            <v-icon>mdi-file-code</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-title>{{ $t('bpmn.buttons.ExportDmn') }}</v-list-tile-title>
        </v-list-tile>
      </template>
      <template v-if="item">
        <v-list-tile v-if="canDeploy(item)" @click="deploy(item)">
          <v-list-tile-avatar>
            <v-icon>save_alt</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-title>{{ $t('bpmn.buttons.Deploy') }}</v-list-tile-title>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile @click="copy(item)">
            <v-list-tile-avatar>
              <v-icon>mdi-content-copy</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-title>{{ $t('bpmn.buttons.Copy') }}</v-list-tile-title>
          </v-list-tile>
        <template v-if="canEdit(item)">
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
        <v-list-tile v-if="canShare(item)" @click="share(item)">
          <v-list-tile-avatar>
            <v-icon>share</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-title>{{ $t('bpmn.buttons.Share') }}</v-list-tile-title>
        </v-list-tile>
      </template>
    </v-list>
  </v-menu>
</template>
<script>
import { eventBus } from '../main';
import { events } from '../constants';
import * as Models from '../api/models';

export default {
  name: 'bpmn-contex-menu',
  props: {
    item: Object,
    offset: Boolean
  },
  computed: {
    canModifySystemObjects() {
      return this.$store.state.bpmn.configuration.canModifySystemObjects;
    },
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
    exportPng(item) {
      this.$emit('export', item, 'png');
    },
    deploy(item) {
      this.$emit('deploy', item);
    },
    copy(item) {
      this.$emit('copy', item);
    },
    share(item) {
      eventBus.$emit(events.modeler.showAccessDialog, item.id);
    },
    isFolder(item) {
      return item instanceof Models.Folder;
    },
    canDeploy(item) {
      return item.hasRight(Models.DiagramAccessRights.Deploy);
    },
    canEdit(item) {
      return item.hasRight(this.isFolder(item) ? Models.FolderAccessRights.Write : Models.DiagramAccessRights.Write);
    },
    canShare(item) {
      return !this.isFolder(item) && item.hasRight(Models.DiagramAccessRights.Share);
    },
    isBpmn(item) {
      return item.type === Models.DiagramType.BPMN;
    },
    isDmn(item) {
      return item.type === Models.DiagramType.DMN;
    }
  },
}
</script>
<style>

</style>