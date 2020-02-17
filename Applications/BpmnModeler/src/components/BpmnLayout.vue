<template>
  <v-app>
    <v-app-bar app fixed dense class="toolbar" elevation="1">
      <router-link :to="{ name: 'main' }" class="logo" >
        <svg class="it-logo">
          <svg viewBox="0 0 170 34.39" id="IT-LOGO"><path d="M6.15 29.74A15.36 15.36 0 0 1 2.87 8.52a7.18 7.18 0 0 0 3.28 3.15zM30.7 17.45A15.35 15.35 0 0 1 6.15 29.74h6.1V11.67a7.16 7.16 0 0 0 3.4-9.56 15.35 15.35 0 0 1 13.77 9.2h-16.1v4h5.13v14.42h6.1v-14.4h6a15.47 15.47 0 0 1 .15 2.12z"></path><circle cx="9.22" cy="5.12" r="5.12"></circle><path d="M45.03 14.9c-7.38 0-8.2 5.65-8.2 7.65s.73 7.47 9 7.47a14.18 14.18 0 0 0 5.83-1.18v-3.55h-.55a9.25 9.25 0 0 1-4.74 1.55c-2.73 0-5-1-5-3.55 3.28 0 9.48.09 10.57.09.31-3.83-.69-8.48-6.91-8.48zm2.37 5.83h-6a3.08 3.08 0 0 1 3.1-2.92 2.59 2.59 0 0 1 2.92 2.92zM68.19 22.55v7.11h-4.55V22.4c0-1.52-.09-2.67-1-3.31-1.17-.82-3.28-.27-4.28.59v10h-4.47V15.45h4.46v1.48c3.1-2.48 6.41-2.52 8.29-.75 1.39 1.27 1.55 2.64 1.55 6.37zM75.48 18.45v5.74c0 4.1 3.64 2.28 3.92 2.28h.36v3c-2.08.66-5.28.78-7-.36a4.36 4.36 0 0 1-1.82-3.74v-6.92h-1.91v-1.82l6.47-3.92v2.64h4.28v3.1z"></path><path d="M87.87 14.9c-5.74 0-8.11 3.83-8.11 7.47s1.55 7.65 8.93 7.65a14.18 14.18 0 0 0 5.83-1.18v-3.55h-.55a9.25 9.25 0 0 1-4.74 1.55c-2.73 0-4.92-1-4.92-3.55 3.28 0 9.38.09 10.48.09.24-3.83-.76-8.48-6.92-8.48zm2.37 5.83h-5.92a2.86 2.86 0 0 1 3-2.92 2.59 2.59 0 0 1 2.92 2.92zM163.03 14.9c-5.74 0-8.11 3.83-8.11 7.47s1.55 7.65 8.93 7.65a14.18 14.18 0 0 0 5.83-1.18v-3.55h-.55a9.25 9.25 0 0 1-4.74 1.55c-2.73 0-4.92-1-4.92-3.55 3.28 0 9.38.09 10.48.09.28-3.83-.72-8.48-6.92-8.48zm2.37 5.83h-5.92a2.86 2.86 0 0 1 3-2.92 2.59 2.59 0 0 1 2.92 2.92zM116.03 14.99a7.73 7.73 0 0 0-4.37 2v-1.63h-4.56a7.85 7.85 0 0 0-5.83 2.1v-2.1h-4.56v14.3h4.56v-9.5c1.73-1.25 4.56-1.8 5.83-.89V34.4h4.56v-5.44a9.45 9.45 0 0 0 3.83 1.06c2.73 0 6.47-2.19 6.47-7.47s-2.38-7.74-5.93-7.56zm-2.55 11.75a7 7 0 0 1-1.82-.21v-7.35a6.12 6.12 0 0 1 2.6-.73c1.78 0 3.05.91 3.05 4s-1.65 4.29-3.84 4.29zM138.62 15.36v14.3h-4.65V19.27c-1.28-.91-4.1-.36-5.83.89v9.5h-4.56v-14.3h4.56v2.09a7.85 7.85 0 0 1 5.83-2.1zM133.97 8.15h4.65v3.64h-4.65zM153.1 16.08v3.55h-.36a7.73 7.73 0 0 0-4.71-1.63c-1.18 0-2.92.27-2.92 1.28 0 1.18 2.73 1.28 4.65 1.73 1.55.36 3.83 1.09 4 4 .24 3.91-4.19 5.1-7.29 5.1a15.85 15.85 0 0 1-6.1-1.18V25.1h.46a8.46 8.46 0 0 0 5.28 1.91c2.46 0 3-.46 3-1.18 0-.91-1.28-1.21-3.64-1.55-1.91-.27-5-1.49-5-4.56a4.4 4.4 0 0 1 2.73-3.83 11.68 11.68 0 0 1 4.83-.91 10.17 10.17 0 0 1 5.07 1.1z"></path></svg>
        </svg>
        <h1 class="text-left blue--text text--darken-2 mr-5 ml-0">ForceBPM modeler</h1>
      </router-link>
      <breadcrumbs class="pl-4" :activeItem.sync="activeItem" />
      <v-spacer></v-spacer>
      <v-col class="icon-container shrink py-0" v-if="currentUser">
        <user-panel mini="true"></user-panel>
      </v-col>
    </v-app-bar>
    <v-content class="grey lighten-4">
      <v-container fluid class="align-start pa-0 fill-height" >
        <router-view ref="modeler"
          @loadItems="loadItems"
          :activeItem.sync="activeItem"/>
      </v-container>
    </v-content>
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
    <bpmn-form :activeItem.sync="activeItem"></bpmn-form>
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
      if (!this.currentUser) {
        return;
      }
      if (!this.$store.state.bpmn.items.length || refresh) {
        await this.loadItems();
      }
      if (this.$store.state.bpmn.items.length) {
        const itemId = this.$route.params.id;
        if (itemId && itemId !== '' && this.activeItem != itemId ) {
          this.activeItem = itemId;
        }
      }
    },
    onCreateDiagram() {
      this.createItem(this.$store.state.bpmn.activeItem, 'process');
    },
    navigateToItem(value) {
      if (!value) {
        return this.$route.name != 'main' ? this.$router.push({name: 'main'}) : '';
      }
      if (!value.id) {
        let elem = this.$store.getters['bpmn/getItemById'](value);
        if (!elem.item) {
          this.$router.push({name: 'ERROR', params: {status_code: '404'}, query: {from: this.$route.name, id: value }});
          return;
        }
        value = elem.item;
      }
      if (this.$route.params.id == value.id && (this.$route.name != 'milestones' && this.$route.name != 'compare' )) { return; }

      if (value instanceof Folder) {
        this.$router.push({name: 'project', params: {id: value.id}});
      } else if (value instanceof Diagram) {
        switch (value.type) {
        case DiagramType.BPMN:
          this.$router.push({name: 'process', params: {id: value.id}});
          break;
        case DiagramType.DMN:
          this.$router.push({name: 'decision', params: {id: value.id}});
          break;
        case DiagramType.CMMN:
          this.$router.push({name: 'case', params: {id: value.id}});
          break;
        default:
          this.$router.push({name: 'ERROR', params: {status_code: '404'}, query: {from: this.$route.name, id: value }});
          break;
        }
      } else {
        this.$router.push({name: 'ERROR', params: {status_code: '404'}, query: {from: this.$route.name, id: value }});
      }
    },
    changeLoad() {
      setTimeout(() => this.loading = false, 10); 
    }
  },
  computed: {
    currentUser() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.$store.state.auth.user = auth.getUserData();
      return this.$store.state.auth.user;
    },
    activeItem: {
      get() {
        return this.$store.getters['bpmn/getActiveItemId'];
      },
      set(value) {
        if (this.$store.getters['bpmn/getActiveItemId'] != null && (this.$route.name != 'milestones' || this.$route.name != 'compare')) {
          this.navigateToItem(value);
        }
        this.$store.dispatch('bpmn/setActiveItem', value);
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
      if (from.name === 'login' || from.name === 'decision' || from.name === 'process') {
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

  .v-tooltip__content {
    left: 10px !important;
    bottom: 12px !important;
    top: auto !important;
  }

  svg.it-logo {
    height: 30px;
    width: 170px;
  }

  svg.it-logo.master {
    padding-left: 2px;
  }
  .logo {
    text-decoration: none;
    flex-direction: row; 
    display: flex;
    color: #1976d2;
    fill: #1976d2;
    h1 {
      font-size: 24px
    }
  }

  .v-input--selection-controls__ripple {
    z-index: 1;
  }

  .icon-container {
    margin-top: 0;
    margin-bottom: 0;
    padding-top: 0;
    padding-bottom: 0;
  }
</style>
