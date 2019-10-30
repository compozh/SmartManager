<template>
  <v-app>
    <vue-title title="IT-Enterprise Workflow modeler"></vue-title>
    <v-toolbar app
      dense
      clipped-left
      clipped-right
      class="toolbar">
      <v-toolbar-side-icon 
        class="blue--text text--darken-2"
        @click.stop="showAppBar = !showAppBar">
      </v-toolbar-side-icon>
      <router-link :to="{ name: 'BPMNEMPTY' }" style="text-decoration: none;">
        <h1 class="text-left blue--text text--darken-2" style="margin: 0 20px;">Workflow modeler</h1>
      </router-link>
      <template v-if="currentUser">
        <bpmn-contex-menu
          @create="createItem"
          @edit="editItem" 
          @remove="removeItem" 
          @import="importItem"
          @export="exportItem">
          <template #activator="{ open }">
            <v-btn icon class="text-left blue--text text--darken-2" v-on="open" :title="$t('bpmn.buttons.AddElement')">
              <v-icon>add</v-icon>
            </v-btn>
          </template>
        </bpmn-contex-menu>
        <v-btn icon class="text-left blue--text text--darken-2" :title="$t('bpmn.buttons.Refresh')" @click="onRouteChanged(true)">
          <v-icon>refresh</v-icon>
        </v-btn>
      </template>
      <v-spacer></v-spacer>
      <v-flex shrink class="icon-container">
        <user-panel mini="true"></user-panel>
      </v-flex>
    </v-toolbar>
    <v-navigation-drawer v-model="appBar"
      app
      clipped
      width="380">
      <bpmn-tree ref="treeView" :items="items" :activeItem.sync="activeItem" @drop="dropItem">
        <template #context-menu="{ item }">
          <bpmn-contex-menu :item="item"
            @create="createItem"
            @edit="editItem" 
            @remove="removeItem" 
            @import="importItem"
            @export="exportItem"
            @deploy="deployItem"
            @copy="copyItem"
            offset>
            <template #activator="{ open }">
              <v-btn flat icon v-on="open">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
          </bpmn-contex-menu>
        </template>
      </bpmn-tree>
    </v-navigation-drawer>
    <v-content class="white">
      <v-container fluid pa-0 fill-height>
        <router-view ref="modeler"/>
      </v-container>
    </v-content>

    <v-dialog v-model="dataLoading"
              full-width
              persistent>
      <v-progress-circular
        :size="70"
        :width="7"
        indeterminate>
      </v-progress-circular>
    </v-dialog>

    <v-snackbar
      v-model="displayMessage"
      :color="messageType"
      :timeout="messageTimeout"
      multi-line
      top
      right
    >
      {{ message }}
      <v-btn
        dark
        flat
        @click="displayMessage = false"
      >
        {{ $t('bpmn.buttons.Close') }}
      </v-btn>
    </v-snackbar>

    <formio-builder-container />
    <formio-container />
    <bpmn-form></bpmn-form>
    <selection-grid></selection-grid>
    <access-dialog></access-dialog>
  </v-app>
</template>

<script>
import { formMixin, importMixin, propertiesPanelEventsHandlersMixin } from './mixins';
import { Folder, Process, ProcessType } from '../api/models';
import * as Dialogs from './dialogs';
import FormioContainer from './formio/Formio';
import { Notification } from 'element-ui';
import { eventBus } from '../main';
import { events } from '../constants';

export default {
  name: 'bpmn-layout',
  components: { SelectionGrid: Dialogs.SelectionGrid, AccessDialog: Dialogs.AccessDialog, FormioContainer },
  mixins: [ formMixin, importMixin, propertiesPanelEventsHandlersMixin ],
  data () {
    return {
      showAppBar: true,
      loading: false,
      displayMessage: false,
      message: '',
      messageTimeout: 10000,
      messageType: 'error'
    };
  },
  mounted() {
    this.onRouteChanged(false);
    eventBus.$on(events.modeler.createDiagram, this.onCreateDiagram);
  },
  methods: {
    async loadItems() {
      this.loading = true;
      await this.$store.dispatch('bpmn/loadConfiguration');
      if (!await this.$store.dispatch('bpmn/loadItems')) {
        Notification.error(this.$t('bpmn.errors.ProcessesNotLoaded'));
      }
      this.loading = false;
    },
    async onRouteChanged(refresh) {
      if (!this.currentUser) {
        return;
      }
      if (!this.$store.state.bpmn.items.length || refresh) {
        await this.loadItems();
      }
      if (this.$store.state.bpmn.items.length) {
        const itemId = this.$route.params.id;
        if (itemId && itemId !== '') {
          this.activeItem = itemId;
        }
      }
    },
    async dropItem(draggingItem, dropItem, type) {
      this.loading = true;
      if (!(await this.$store.dispatch('bpmn/itemDropped', { draggingItem, dropItem, type }))) {
        Notification.error(this.$t('bpmn.errors.CantDrop'));
      }
      this.activeItem = draggingItem.id;
      this.loading = false;
    },
    exportItem(item, type) {
      eventBus.$emit(events.modeler.export, type);
    },
    async deployItem(item) {
      this.loading = true;
      var result = await this.$store.dispatch('bpmn/deployProcess', item.id);
      if (result.success) {
        Notification.success(result.message || this.$t('bpmn.errors.ProcessDeployed'));
      } else {
        Notification.error(result.message || this.$t('bpmn.errors.ProcessNotDeployed'));
      }
      this.loading = false;
    },
    navigateToItem(itemId) {
      const { item, index } = this.$store.getters['bpmn/getItemById'](itemId);
      let routeName, params;
      if (index < 0) {
        routeName = 'BPMNEMPTY';
        params = { };
      } else if (item instanceof Folder) {
        routeName = 'BPMNFOLDER';
        params = { id: itemId };
      } else if (item instanceof Process) {
        switch (item.type) {
        case ProcessType.BPMN:
          routeName = 'BPMNMODELER';
          params = { id: itemId };
          break;
        case ProcessType.DMN:
          routeName = 'DMNMODELER';
          params = { id: itemId };
          break;
        }
      }
      if (this.$route.name !== routeName || this.$route.params.id !== params.id) {
        this.$router.push({ name: routeName, params });
      }
    },
    onCreateDiagram() {
      this.createItem(this.$store.state.bpmn.activeItem, 'process');
    }
  },
  computed: {
    currentUser() {
      if (this.$store.state.authentication.currentUser) {
        return this.$store.state.authentication.currentUser;
      }
      return null;
    },
    appBar: {
      get() {
        return this.showAppBar && this.currentUser !== null;
      },
      set(value) {
        this.showAppBar = value;
      }
    },
    items() {
      return this.$store.state.bpmn.items;
    },
    activeItem: {
      get() {
        return this.$store.getters['bpmn/getActiveItemId'];
      },
      set(value) {
        this.$store.dispatch('bpmn/setActiveItem', value);
        this.$refs.treeView.setActiveItem(value);
        this.navigateToItem(value);
      }
    },
    dataLoading() {
      return this.$store.getters['formio/linearLoader'] || this.loading;
    },
    snackbar() {
      return this.$store.getters['formio/snackbar']; 
    },
    snackbarVisible() {
      return this.snackbar.visible; 
    }
  },
  watch: {
    '$route'(to, from) {
      if (from.name === 'BPMNLOGIN') {
        this.appBar = true;
        this.onRouteChanged(true);
      }
    },
    snackbarVisible() {
      Notification({
        message: this.snackbar.message,
        type: this.snackbar.type
      });
    }
  },
  beforeDestroy() {
    eventBus.$off(events.modeler.createDiagram, this.onCreateDiagram);
  }
};
</script>
<style lang="scss">
  .toolbar {
    background: #fff;
    box-shadow: inset 0 -1px 0 rgba(100, 121, 143, 0.122);
  }

  .v-dialog {
    box-shadow: none;
    overflow: hidden;
  }

  .tree-btn {
    text-transform: none;
    margin: 0;
    padding: 0 20px;
  }

  .tree-btn > .v-btn__content {
    justify-content: flex-start;
  }

  .user-icon,
  .user-image {
    height: 40px !important;
    width: 40px !important;
    font-size: 40px !important;
  }

  .el-notification {
    font-family: "Roboto";
    border-radius: 0px;
  }

  .component-settings {
    @import './../formio/assets/theme.scss';
    @import "~formiojs/dist/formio.full.min.css";
    @import "~bootstrap/scss/bootstrap";
    @import './../formio/assets/overide.scss';
    @import "~choices.js/public/assets/styles/choices.css";
    @import "~flatpickr/dist/flatpickr.min.css";
    position: absolute;
    z-index: 102;
    background-color: #fff;
    top: 20px;
    left: 20px;
    right: 20px;
    bottom: 20px;
    overflow-y: auto;
    overflow-x: hidden;
    border-radius: 10px;
    padding: 5px;
    font-family: Roboto;
  }
  .formcomponent {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    line-height: 1.5;
    border-radius: 0.2rem;
    color: #fff;
    background-color: #1976d2;
    border-color: #1976d2;
    text-align: left !important;
    vertical-align: middle;
    font-family: Roboto;
  }
</style>
