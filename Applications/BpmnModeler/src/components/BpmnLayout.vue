<template>
  <v-app>
    <vue-title title="Bpmn"></vue-title>
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
                         width="270">
      <v-container fluid pa-0 fill-height>
        <v-layout column>
          <v-btn flat large class="tree-btn" @click="createDiagram()">
            <v-icon left>add</v-icon> {{ $tc('AddElement') }}
          </v-btn>
          <v-divider></v-divider>
          <bpmn-models :models="models" :activeModel.sync="activeModel" @rename="renameModel" @remove="removeModel"></bpmn-models>
          <v-divider></v-divider>
          <v-btn flat large class="tree-btn" @click="onRouteChanged(true)">
            <v-icon left>refresh</v-icon> {{ $tc('Refresh') }}
          </v-btn>
        </v-layout>
      </v-container>
    </v-navigation-drawer>

    <v-content class="white">
      <v-container fluid pa-0 fill-height>
        <router-view />
      </v-container>
    </v-content>

    <v-dialog persistent v-model="showForm" max-width="500">
      <bpmn-model-form :model="formModel" :loading="formLoading" :mode="formMode" @save="formSave" @close="formClose"></bpmn-model-form>
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
        {{ $tc('Close') }}
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import ModelForm from './Views/ModelForm'

export default {
  name: 'bpmn-layout',
  props: ['toolbarTitle'],
  components: {
    'bpmn-model-form': ModelForm
  },
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
      formLoading: false
    };
  },
  mounted() {
    this.onRouteChanged(false);
  },
  methods: {
    async loadModels() {
      this.loading = true;
      if (!await this.$store.dispatch('bpmn/loadModels')) {
        this.error = this.$tc('Models not loaded');
        this.showError = true;
      }
      this.loading = false;
    },
    async onRouteChanged(refresh) {
      if (!this.currentUser) {
        return;
      }
      if (!this.$store.state.bpmn.models.length || refresh) {
        await this.loadModels();
      }
      if (this.$store.state.bpmn.models.length) {
        const modelId = this.$route.params.id;
        if (modelId && modelId !== '') {
          this.$store.dispatch('bpmn/setActiveModel', modelId);
        }
      }
    },
    createDiagram() {
      this.formMode = 'create';
      this.formModel = { name: this.$tc('NewDiagram'), xmlView: '' };
      this.showForm = true;
    },
    async formSave(model) {
      this.formLoading = true;
      switch (this.formMode) {
      case 'create':
        if (await this.$store.dispatch('bpmn/createModel', model)) {
          this.showForm = false;
        } else {
          this.error = this.$tc('ModelNotCreated');
          this.showError = true;
        }
        break;
      case 'edit':
        if (await this.$store.dispatch('bpmn/setModelName', model)) {
          this.showForm = false;
        } else {
          this.error = this.$tc('ModelNotEdited');
          this.showError = true;
        }
        break;
      case 'delete':
        if (await this.$store.dispatch('bpmn/deleteModel', model)) {
          this.showForm = false;
        } else {
          this.error = this.$tc('ModelNotDeleted');
          this.showError = true;
        }
        break;
      }
      this.formLoading = false;
    },
    formClose() {
      this.showForm = false;
    },
    renameModel(model) {
      this.formMode = 'edit';
      this.formModel = Object.assign({}, model);
      this.showForm = true;
    },
    removeModel(model) {
      this.formMode = 'delete';
      this.formModel = model;
      this.showForm = true;
    },
    navigateToModel(modelId) {
      const { model, index } = this.$store.getters['bpmn/getModelById'](modelId);
      if (index < 0) {
        this.$router.push({ name: 'BPMNEMPTY' });
      } else if (model.isFolder) {
        this.$router.push({ name: 'BPMNFOLDER', params: { id: modelId } });
      } else {
        this.$router.push({ name: 'BPMNMODELER', params: { id: modelId } });
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
    models() {
      return this.$store.state.bpmn.models;
    },
    activeModel: {
      get() {
        if (this.$store.state.bpmn.activeModel) {
          return this.$store.state.bpmn.activeModel.id;
        } else {
          return null;
        }
      },
      set(value) {
        if (value === this.activeModel) {
          return;
        }
        this.$store.dispatch('bpmn/setActiveModel', value);
        this.navigateToModel(value);
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

  .circular-loader {
    background-color: rgba(255, 255, 255, .5);
    z-index: 10;
  }

  .linear-loader {
    position: absolute;
    bottom: 0;
    left: 0;
    margin: 0;
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
