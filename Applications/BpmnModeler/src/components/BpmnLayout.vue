<template>
  <v-app>
    <v-app-bar app fixed  class="toolbar" elevation="3">
      <router-link :to="{ name: 'Main' }" style="text-decoration: none;">
        <h1 class="text-left blue--text text--darken-2" style="margin: 0 20px;">Workflow modeler</h1>
      </router-link>
      <!-- <v-btn icon class="text-left blue--text text--darken-2" :title="$t('bpmn.buttons.Refresh')" @click="onRouteChanged(true)">
        <v-icon>refresh</v-icon>
      </v-btn> -->
      <breadcrumbs class="pl-4" :activeItem.sync="activeItem" />
      <v-spacer></v-spacer>
      <v-flex shrink class="icon-container" v-if="currentUser">
        <user-panel mini="true"></user-panel>
      </v-flex>
    </v-app-bar>
    <!-- <v-navigation-drawer v-model="appBar"
      app
      clipped
      width="380">
      <bpmn-tree ref="treeView" :items="items" " @drop="dropItem">
        <template #context-menu="{ item }">
          <bpmn-contex-menu :item="item"
            @create="createItem"
            @edit="editItem" 
            @remove="removeItem" 
            @import="importItem"
            @export="exportItem"
            @copy="copyItem"
            offset>
            <template #activator="{ open }">
              <v-btn text icon v-on="open">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
          </bpmn-contex-menu>
        </template>
      </bpmn-tree>
    </v-navigation-drawer> -->
    <v-content class="grey lighten-4">
      <v-container fluid pa-0 fill-height class="align-start" >
        <router-view ref="modeler" v-if="!loading" 
          :activeItem.sync="activeItem"/>
      </v-container>
    </v-content>
    <!-- <v-row >
      <router-link tag="h1" :to="{ name:'Main'}" > <v-btn>Main</v-btn></router-link>
      <router-link tag="h1" :to="{ name:'Process'}" ><v-btn>Process</v-btn></router-link>
      <router-link tag="h1" :to="{ name:'Decision'}"  ><v-btn>Decision</v-btn></router-link>
      <router-link tag="h1" :to="{ name:'Project'}"  ><v-btn>Project</v-btn></router-link>
    </v-row> -->

    <v-dialog v-model="dataLoading" persistent>
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
        text
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
import { Folder, Diagram, DiagramType } from '../api/models';
import * as Dialogs from './dialogs';
import FormioContainer from './formio/Formio';
import { Notification } from 'element-ui';
import { eventBus } from '../main';
import { events } from '../constants';
import auth from '@it-enterprise/jwtauthentication';

export default {
  name: 'bpmn-layout',
  components: { SelectionGrid: Dialogs.SelectionGrid, AccessDialog: Dialogs.AccessDialog, FormioContainer },
  mixins: [ formMixin, importMixin, propertiesPanelEventsHandlersMixin ],
  data () {
    return {
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
      await this.$store.dispatch('bpmn/resetCache');
      await this.$store.dispatch('bpmn/loadConfiguration');
      if (!(await this.$store.dispatch('bpmn/loadItems'))) {
        Notification.error(this.$t('bpmn.errors.ProcessesNotLoaded'));
      }
      this.loading = false;
    },
    async onRouteChanged(refresh) {
      // debugger
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
      // debugger
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
    onCreateDiagram() {
      this.createItem(this.$store.state.bpmn.activeItem, 'process');
    },
    navigateToItem(value) {
      if(!value.id) {
        let elem = this.$store.getters['bpmn/getItemById'](value)
        value = elem.item
      } 
      if( this.$route.params.id == value.id) return
      value.type == 'BPMN' ? this.$router.push({name: 'Process', params: {id: value.id}}) 
      : value.type == 'DMN' ? this.$router.push({name: 'Decision', params: {id: value.id}})
        : this.$router.push({name: 'Project', params: {id: value.id}}) 
    },
  },
  computed: {
    currentUser() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.$store.state.auth.user = auth.getUserData();
      return this.$store.state.auth.user;
    },
    items() {
      return this.$store.state.bpmn.items;
    },
    activeItem: {
      get() {
        // debugger
        return this.$store.getters['bpmn/getActiveItemId'];
      },
      set(value) {
        // debugger
        this.$store.dispatch('bpmn/setActiveItem', value);
        this.navigateToItem(value)
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
      if (from.name === 'Login') {
        this.appBar = true;
        this.onRouteChanged(true);
      }
    },
    snackbarVisible() {
      if (this.snackbar.type === 'error') {
        console.error(this.snackbar.message);
      }
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
    height: 48px;
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
</style>
