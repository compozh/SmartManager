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

    <v-dialog :persistent="formLoading" v-model="showForm" max-width="500">
      <bpmn-form ref="form" :model="formModel" :loading="formLoading" :mode="formMode" :type="formType" @save="formSave" @close="formClose"></bpmn-form>
    </v-dialog>

    <v-dialog v-model="showSelectionGrid" max-width="800">
      <selection-grid :items="selectionGridItems" @select="onSelectionGridSelect" @cancel="showSelectionGrid = false"></selection-grid>
    </v-dialog>

    <v-dialog v-model="loading"
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
    
  </v-app>
</template>

<script>
import treeSearch from '../api/treeSearch';
import formMixin from './mixins/formMixin';
import { importMixin } from './mixins/importExportMixin' 
import Folder from '../api/models/Folder';
import Process from '../api/models/Process';
import ProcessType from '../api/models/ProcessType';
import SelectionGrid from './SelectionGrid'
import { eventBus } from '../main'

export default {
  name: 'bpmn-layout',
  components: { SelectionGrid },
  mixins: [ formMixin, importMixin ],
  data () {
    return {
      showAppBar: true,
      loading: false,
      displayMessage: false,
      message: '',
      messageTimeout: 10000,
      messageType: 'error',
      showSelectionGrid: false,
      selectionGridItems: [],
      propertiesPanelCallback: null
    };
  },
  mounted() {
    this.onRouteChanged(false);
    eventBus.$on('add-process', () => this.createItem(this.$store.state.bpmn.activeItem, 'process'));
    eventBus.$on('properties-panel.set-external-task-properties', (taskCode, callback) => {

    });
    eventBus.$on('properties-panel.select-external-task', this.onPropertiesPanelSelectTask);
  },
  methods: {
    async loadItems() {
      this.loading = true;
      await this.$store.dispatch('bpmn/loadConfiguration');
      if (!await this.$store.dispatch('bpmn/loadItems')) {
        this.showMessage(this.$t('bpmn.errors.ProcessesNotLoaded'), 'error');
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
        this.showMessage(this.$t('bpmn.errors.CantDrop'), 'error');
      }
      this.activeItem = draggingItem.id;
      this.loading = false;
    },
    exportItem(item, type) {
      const [{ item: modeler } = {}] = treeSearch([this.$refs.modeler], e => e.$options.name === type + '-modeler', e => e.$children);
      if (modeler && modeler.export) {
        modeler.export(type);
      }
    },
    async deployItem(item) {
      this.loading = true;
      var result = await this.$store.dispatch('bpmn/deployProcess', item.id);
      if (result.success) {
        this.showMessage(result.message || this.$t('bpmn.errors.ProcessDeployed'), 'success');
      } else {
        this.showMessage(result.message || this.$t('bpmn.errors.ProcessNotDeployed'), 'error');
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
    showMessage(message, type) {
      this.message = message;
      this.messageType = type;
      this.displayMessage = true;
    },
    async onPropertiesPanelSelectTask(taskCode, definitionType, callback) {
      this.loading = true;
      var items = await this.$store.dispatch('bpmn/getAvailableActions', { processId: this.activeItem, definitionType });
      if (!items) {
        this.loading = false;
        this.message = this.$t('bpmn.errors.ActionsNotLoaded');
        this.messageType = 'error';
        this.displayMessage = true;
        return;
      }
      this.loading = false;
      this.propertiesPanelCallback = callback;
      this.selectionGridItems = items;
      this.showSelectionGrid = true;
    },
    onSelectionGridSelect(item) {
      this.showSelectionGrid = false;
      if (!item) {
        return;
      }
      this.propertiesPanelCallback(item.id);
      this.propertiesPanelCallback = null;
      this.selectionGridItems = [];
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
        return this.$store.getters['bpmn/getActiveItemId']
      },
      set(value) {
        this.$store.dispatch('bpmn/setActiveItem', value);
        this.$refs.treeView.setActiveItem(value);
        this.navigateToItem(value);
      }
    }
  },
  watch: {
    '$route'(to, from) {
      if (from.name === 'BPMNLOGIN') {
        this.appBar = true;
        this.onRouteChanged(true);
      }
    }
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
  .user-image {
    height: 40px !important;
    width: 40px !important;
  }
  .component-settings /deep/ {
    @import url('https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css');
    @import "~formiojs/dist/formio.full.css";
    @import "~bootstrap/dist/css/bootstrap";
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
</style>
