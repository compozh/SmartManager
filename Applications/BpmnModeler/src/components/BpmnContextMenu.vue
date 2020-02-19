<template>
  <v-menu close-on-click
          close-on-content-click
          :offset-x="offset"
          offset-y>
    <template v-slot:activator="{ on }">
      <slot name="activator" :open="on"></slot>
    </template>
    <v-list :dense="milestones">
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
      <!-- <template v-if="item && !onlyExport">
        <v-list-item v-if="canDeploy(item) && !crumb" @click="deploy(item)">
          <v-list-item-avatar>
            <v-icon>save_alt</v-icon>
          </v-list-item-avatar>
          <v-list-item-title>{{ $t('bpmn.buttons.Deploy') }}</v-list-item-title>
        </v-list-item> </template>  -->
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
        <template v-else-if="isCmmn(item)">
          <v-list-item @click="exportCmmn(item)">
            <v-list-item-avatar>
              <v-icon>mdi-file-code</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>{{ $t('bpmn.buttons.ExportCmmn') }}</v-list-item-title>
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
      <template v-if="crumb">
        <template v-if="!isFolder(item)">
          <v-list-item @click="createVersion(item)">
            <v-list-item-avatar>
              <v-icon>mdi-source-commit</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>{{ $t('bpmn.buttons.AddMilestone') }}</v-list-item-title>
          </v-list-item>
          <router-link :to="{ name: 'milestones', params: {id: $route.params.id}}" tag="v-list-item">
            <v-list-item-avatar>
              <v-icon>mdi-cards-outline</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>{{ $t('bpmn.buttons.MilestonesHistory') }}</v-list-item-title>
          </router-link>
          <v-divider  />
        </template>
        <v-list-item v-if="canShare(item)" @click="share(item)">
          <v-list-item-avatar>
            <v-icon>mdi-account-plus</v-icon>
          </v-list-item-avatar>
          <v-list-item-title>{{ $t('bpmn.buttons.Share') }}</v-list-item-title>
        </v-list-item>
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
        
        <template v-if="!isFolder(item) && canEdit(item)">
          <v-menu offset-x bottom
            v-model="explorer"
            :close-on-click="false"
            :close-on-content-click="false">
            <template v-slot:activator="{ on }">
              <v-list-item  v-on="on">
                <v-list-item-avatar>
                  <v-icon>mdi-content-copy</v-icon>
                </v-list-item-avatar>
                <v-list-item-title>{{ $t('bpmn.buttons.Copy') }}</v-list-item-title>
              </v-list-item>
            </template>
            <file-explorer :itemId="item.parentId" :chosen="[item]" :explorer.sync="explorer" mode="copy"/>
          </v-menu>
          <v-list-item>
            <v-list-item-avatar>
              <v-icon>mdi-repeat</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>{{ $t('bpmn.buttons.Replace') }}</v-list-item-title>
          </v-list-item>
        </template>
      </template>

      <template v-if="milestones" >
        <v-list-item >
          <v-list-item-avatar>
            <v-icon>mdi-pencil</v-icon>
          </v-list-item-avatar>
          <v-list-item-title>{{ $t('bpmn.buttons.Rename') }}</v-list-item-title>
        </v-list-item>
        <v-list-item >
          <v-list-item-avatar>
            <v-icon>mdi-delete</v-icon>
          </v-list-item-avatar>
          <v-list-item-title>{{ $t('bpmn.buttons.Delete') }}</v-list-item-title>
        </v-list-item>
        <v-list-item >
          <v-list-item-avatar>
            <v-icon>mdi-backup-restore</v-icon>
          </v-list-item-avatar>
          <v-list-item-title>{{ $t('bpmn.buttons.RestoreAsLatest') }}</v-list-item-title>
        </v-list-item>
        <v-list-item @click="compare(item, '')">
          <v-list-item-avatar>
            <v-icon>mdi-compare</v-icon>
          </v-list-item-avatar>
          <v-list-item-title>{{ $t('bpmn.buttons.Compare') }}</v-list-item-title>
        </v-list-item>
        <v-menu offset-x bottom
          v-model="explorer"
          :close-on-click="false"
          :close-on-content-click="false">
          <template v-slot:activator="{ on }">
            <v-list-item  v-on="on">
              <v-list-item-avatar>
                <v-icon>mdi-content-copy</v-icon>
              </v-list-item-avatar>
              <v-list-item-title>{{ $t('bpmn.buttons.Copy') }}</v-list-item-title>
            </v-list-item>
          </template>
          <file-explorer :itemId="item.parentId" :chosen="[item]" :explorer.sync="explorer" mode="copy"/>
        </v-menu>
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
  data() {
    return {
      explorer: false,
    };
  },
  props: {
    item: Object,
    offset: Boolean,
    crumb: Boolean,
    onlyExport: Boolean,
    milestones: Boolean
  },
  computed: {
    canModifySystemObjects() {
      return this.$store.state.bpmn.configuration.canModifySystemObjects;
    },
  },
  methods: {
    compare(item1, item2) {
      item2 = '1c67ec53-cc27-4d10-9171-1610d595b23f';
      this.$emit('compare', item1.id || item1, item2.id || item2);
    },
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
    exportCmmn(item) {
      this.$emit('export', item, 'cmmn');
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
      if (!item) { return false; }
      return item.hasRight(Models.AccessRights.Deploy);
    },
    canEdit(item) {
      if (!item) { return false; }
      return item.hasRight(Models.AccessRights.Write);
    },
    canShare(item) {
      if (!item) { return false; }
      return item.hasRight(Models.AccessRights.Share);
    },
    isBpmn(item) {
      return item instanceof Models.Diagram && item.type === Models.DiagramType.BPMN;
    },
    isCmmn(item) {
      return item instanceof Models.Diagram && item.type === Models.DiagramType.CMMN;
    },
    isDmn(item) {
      return item instanceof Models.Diagram && item.type === Models.DiagramType.DMN;
    },
    async createVersion(item) {
      await this.$store.dispatch('bpmn/createDiagramVersion', item.id || item)
    }
  },
};
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
a {
  text-decoration: none;
}
</style>