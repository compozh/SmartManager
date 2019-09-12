<template>
  <v-app>
    <vue-title title="IT-Enterprise Workflow modeler"></vue-title>
    <v-toolbar app
               clipped-left
               class="toolbar">
      <v-toolbar-side-icon 
        class="blue--text text--darken-2"
        @click.stop="showAppBar = !showAppBar">
      </v-toolbar-side-icon>
      <v-toolbar-title>{{ toolbarTitle }}</v-toolbar-title>
      <router-view name="toolbar" />
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-navigation-drawer v-model="appBar"
                         app
                         clipped
                         width="380">
      <v-container fluid pa-0 fill-height>
        <v-layout column>
          <bpmn-contex-menu
            @create="createItem"
            @edit="editItem" 
            @remove="removeItem" 
            @import="importItem"
            @export="exportItem">
            <template #activator="{ open }">
              <v-btn flat large class="tree-btn" v-on="open">
                <v-icon left>add</v-icon> {{ $t('bpmn.buttons.AddElement') }}
              </v-btn>
            </template>
          </bpmn-contex-menu>
          <v-divider></v-divider>
          <bpmn-tree :items="items" :activeItem.sync="activeItem">
            <template #context-menu="{ item }">
              <bpmn-contex-menu :item="item"
                @create="createItem"
                @edit="editItem" 
                @remove="removeItem" 
                @import="importItem"
                @export="exportItem"
                offset>
                <template #activator="{ open }">
                  <v-btn flat icon v-on="open">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
              </bpmn-contex-menu>
            </template>
          </bpmn-tree>
          <v-divider></v-divider>
          <v-btn flat large class="tree-btn" @click="onRouteChanged(true)">
            <v-icon left>refresh</v-icon> {{ $t('bpmn.buttons.Refresh') }}
          </v-btn>
        </v-layout>
      </v-container>
    </v-navigation-drawer>

    <v-content class="white">
      <v-container fluid pa-0 fill-height>
        <router-view ref="modeler"/>
      </v-container>
    </v-content>

    <v-dialog :persistent="formLoading" v-model="showForm" max-width="500">
      <bpmn-form :model="formModel" :loading="formLoading" :mode="formMode" :type="formType" @save="formSave" @close="formClose"></bpmn-form>
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
      v-model="showError"
      color="error"
      :timeout="errorTimeout"
      multi-line
      top
      right
    >
      {{ error }}
      <v-btn
        dark
        flat
        @click="showError = false"
      >
        {{ $tc('bpmn.buttons.Close') }}
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import Folder from '../api/models/Folder';
import Process from '../api/models/Process';
import treeSearch from '../api/treeSearch';

export default {
  name: 'bpmn-layout',
  props: ['toolbarTitle'],
  data () {
    return {
      showAppBar: true,
      loading: false,
      showError: false,
      error: '',
      errorTimeout: 10000,
      showForm: false,
      formMode: 'create',
      formModel: undefined,
      formLoading: false,
      formType: 'process'
    };
  },
  mounted() {
    this.onRouteChanged(false);
  },
  methods: {
    async loadItems() {
      this.loading = true;
      if (!await this.$store.dispatch('bpmn/loadItems')) {
        this.error = this.$tc('bpmn.errors.ProcessesNotLoaded');
        this.showError = true;
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
    async formSave(item, type) {
      this.formLoading = true;
      let success = false;
      switch (this.formMode) {
      case 'create':
        if (type === 'folder') {
          success = await this.$store.dispatch('bpmn/createFolder', item);
        } else {
          success = await this.$store.dispatch('bpmn/createProcess', item);
        }
        if (success) {
          this.showForm = false;
          this.activeItem = item.id;
        } else {
          this.error = this.$t('bpmn.errors.ProcessNotCreated');
          this.showError = true;
        }
        break;
      case 'edit':
        if (type === 'folder') {
          success = await this.$store.dispatch('bpmn/editFolder', item);
        } else {
          success = await this.$store.dispatch('bpmn/editProcess', item);
        }
        if (success) {
          this.showForm = false;
        } else {
          this.error = this.$t('bpmn.errors.ProcessNotEdited');
          this.showError = true;
        }
        break;
      case 'delete':
        if (await this.$store.dispatch('bpmn/deleteItem', item)) {
          this.showForm = false;
        } else {
          this.error = this.$t('bpmn.errors.ProcessNotDeleted');
          this.showError = true;
        }
        break;
      }
      this.formLoading = false;
    },
    formClose() {
      this.showForm = false;
    },
    createItem(parent, type, xmlView) {
      const parentId = parent ? parent.id : null;
      this.formMode = 'create';
      this.formModel = type === 'folder' ? new Folder({ parentId }) : new Process({ parentId, xmlView });
      this.formType = type;
      this.showForm = true;
    },
    editItem(item) {
      this.formMode = 'edit';
      this.formModel = item.isFolder ? new Folder(item) : new Process(item);
      this.formType = item.isFolder ? 'folder' : 'process';
      this.showForm = true;
    },
    removeItem(item) {
      this.formMode = 'delete';
      this.formModel = item;
      this.formType = item.isFolder ? 'folder' : 'process';
      this.showForm = true;
    },
    importItem(parent) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.bpmn';

      input.addEventListener('change', () => {
        const [file] = input.files;
        if (!file) {
          return;
        }
        file.text().then(xml => {
          setTimeout(function() {
            document.body.removeChild(input);  
          }, 0);

          this.createItem(parent, 'process', xml);
        });
      });
      document.body.appendChild(input);
      input.click();
    },
    exportItem(item, type) {
      const [{ item: modeler } = {}] = treeSearch([this.$refs.modeler], e => e.$options.name === 'bpmn-modeler', e => e.$children);
      if (modeler && modeler.export) {
        modeler.export(type);
      }
    },
    navigateToItem(itemId) {
      const { item, index } = this.$store.getters['bpmn/getItemById'](itemId);
      let routeName, params;
      if (index < 0) {
        routeName = 'BPMNEMPTY';
      } else if (item.isFolder) {
        routeName = 'BPMNFOLDER';
        params = { id: itemId };
      } else {
        routeName = 'BPMNMODELER';
        params = { id: itemId };
      }

      if (this.$route.name !== routeName || this.$route.params.id !== params.id) {
        this.$router.push({ name: routeName, params });
      }

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
        if (value == this.activeItem) {
          return;
        }
        this.$store.dispatch('bpmn/setActiveItem', value);
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
<style>
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
</style>
