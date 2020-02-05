<template>
  <v-menu close-on-click
          close-on-content-click
          :offset-x="offset"
          offset-y>
    <template v-slot:activator="{ on }">
      <slot name="activator" :open="on"></slot>
    </template>
    <v-list>
      <!-- <template v-if="(!item || isFolder(item)) && !crumb && !onlyExport">
        <v-list-item @click="addFolder(item)">
          <v-list-item-avatar>
            <v-icon>mdi-folder-plus</v-icon>
          </v-list-item-avatar>
          <v-list-item-title>{{ $t('bpmn.buttons.AddFolder') }}</v-list-item-title>
        </v-list-item>
        <v-list-item @click="addProcess(item)">
          <v-list-item-avatar>
            <v-icon>mdi-file-tree</v-icon>
          </v-list-item-avatar>
          <v-list-item-title>{{ $t('bpmn.buttons.AddProcess') }}</v-list-item-title>
        </v-list-item>
        <v-list-item @click="importBpmn(item)">
          <v-list-item-avatar>
            <v-icon>mdi-import</v-icon>
          </v-list-item-avatar>
          <v-list-item-title>{{ $t('bpmn.buttons.Import') }}</v-list-item-title>
        </v-list-item>
      </template> -->
      <template v-if="onlyExport">
        <template v-if="isBpmn(item)">
          <v-list-item @click="exportBpmn(item)">
            <v-list-item-avatar>
              <v-icon>mdi-file-code</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>{{ $t('bpmn.buttons.ExportBpmn') }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="exportSvg(item)">
            <v-list-item-avatar>
              <v-icon>mdi-file-image</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>{{ $t('bpmn.buttons.ExportSvg') }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="exportPng(item)">
            <v-list-item-avatar>
              <v-icon>mdi-file-image-outline</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>{{ $t('bpmn.buttons.ExportPng') }}</v-list-item-title>
          </v-list-item>
        </template>
        <template v-else-if="isDmn(item)">
          <v-list-item @click="exportDmn(item)">
            <v-list-item-avatar>
              <v-icon>mdi-file-code</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>{{ $t('bpmn.buttons.ExportDmn') }}</v-list-item-title>
          </v-list-item>
        </template>
      </template>
      <!-- <template v-if="item && !onlyExport">
        <v-list-item v-if="canDeploy(item) && !crumb" @click="deploy(item)">
          <v-list-item-avatar>
            <v-icon>save_alt</v-icon>
          </v-list-item-avatar>
          <v-list-item-title>{{ $t('bpmn.buttons.Deploy') }}</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="canShare(item)" @click="share(item)">
          <v-list-item-avatar>
            <v-icon>share</v-icon>
          </v-list-item-avatar>
          <v-list-item-title>{{ $t('bpmn.buttons.Share') }}</v-list-item-title>
        </v-list-item>
      </template> -->
      <template v-if="crumb">
        <template v-if="canEdit(item)">
          <v-list-item @click="edit(item)">
            <v-list-item-avatar>
              <v-icon>mdi-pencil</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>{{ $t('bpmn.buttons.Rename') }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="remove(item)">
            <v-list-item-avatar>
              <v-icon>mdi-delete</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>{{ $t('bpmn.buttons.Delete') }}</v-list-item-title>
          </v-list-item>
        </template>
        <template v-if="!isFolder(item)">
          <v-list-item @click="copy(item)">
            <v-list-item-avatar>
              <v-icon>mdi-content-copy</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>{{ $t('bpmn.buttons.Copy') }}</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="canEdit(item)">
            <v-list-item-avatar>
              <v-icon>mdi-repeat</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>{{ $t('bpmn.buttons.Replace') }}</v-list-item-title>
          </v-list-item>
        </template>
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
    offset: Boolean,
    crumb: Boolean,
    onlyExport: Boolean
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
      eventBus.$emit(events.modeler.showAccessDialog, item);
    },
    isFolder(item) {
      return item instanceof Models.Folder;
    },
    canDeploy(item) {
      return item.hasRight(Models.AccessRights.Deploy);
    },
    canEdit(item) {
      return item.hasRight(Models.AccessRights.Write);
    },
    canShare(item) {
      return item.hasRight(Models.AccessRights.Share);
    },
    isBpmn(item) {
      if(!item) return false
      return item.type === Models.DiagramType.BPMN;
    },
    isDmn(item) {
      if(!item) return false
      return item.type === Models.DiagramType.DMN;
    }
  },
}
</script>
<style>
.v-list-item__avatar {
  margin-bottom: 0px;
  margin-top: 0px;
}
.v-list-item__title {
  text-align: start;
  font-size: 14px
}
</style>