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
      <router-view name="models" />
    </v-navigation-drawer>

    <v-content class="white">
      <v-container fluid pa-0 fill-height>
        <router-view></router-view>
      </v-container>
    </v-content>

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
export default {
  name: 'bpmn-layout',
  props: ['toolbarTitle'],
  data () {
    return {
      showAppBar: true,
      loading: false,
      showError: false,
      error: false,
      errorTimeout: 10000
    };
  },
  created() {
    this.loadModels(this.$router.route);
  },
  mounted() {
  },
  methods: {
    async loadModels() {
      if (!await this.$store.dispatch('bpmn/loadModels')) {
        this.error = this.$tc('Models not loaded');
        this.showError = true;
      }
    },
    async onRouteChanged() {
      if (!this.$store.state.bpmn.models.length) {
        this.loading = true;
        await this.loadModels();
        this.loading = false;
      }
      if (this.$store.state.bpmn.models.length) {
        const modelId = this.$route.params.id;
        if (modelId && modelId !== '') {
          this.$store.dispatch('bpmn/setActiveModel', modelId);
        }
      }
    }
  },
  computed: {
    currentUser() {
      if (this.$store.state.authentication.currentUser) {
        return this.$store.state.authentication.currentUser.UserData.CurrentUserData.UserName;
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
    }
  },
  watch: {
    '$route': 'onRouteChanged'
  },
  beforeRouteEnter(to, from, next) {
    window.alert('beforeRouteEnter');
    console.log('beforeRouteEnter');
    next(vm => vm.loadModels());
  },
  beforeRouteUpdate(to, from, next) {
    window.alert('beforeRouteUpdate');
    console.log('beforeRouteUpdate');
    this.loadModels().then(success => next(success));
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
    overflow: visible;
  }
</style>
