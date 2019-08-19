<template>
  <v-app id="mes-app">
    <v-navigation-drawer v-if="currentUser" app clipped hide-overlay :mini-variant="menuMiniMode" v-model="drawer">
      <router-view name="navigation-drawer"/>
    </v-navigation-drawer>
    <v-toolbar app fixed clipped-left extended :extension-height="3">
      <v-toolbar-side-icon v-if="currentUser" @click.stop="toggleMenuMode"></v-toolbar-side-icon>
      <router-view name="toolbar"/>
      <v-spacer></v-spacer>
      <!-- <language-component/> -->
      <v-progress-linear :id="linearLoader" slot="extension" v-if="linearLoader" :indeterminate="linearLoader" ma-0 height="2"></v-progress-linear>
    </v-toolbar>
    <v-content>
      <v-container class="main-block">
        <router-view/>
      </v-container>
    </v-content>
    <template v-if="snackbar.visible">
      <v-snackbar
        :top="true"
        :multi-line="true"
        :timeout="5000"
        :color=snackbar.type
        @input="closeSnackbar"
        :value="true"
      >
        {{ snackbar.message }}
        <v-btn flat dark @click.native="closeSnackbar">
          Закрыть
        </v-btn>
      </v-snackbar>
    </template>
    <v-dialog
      v-model="dialogLinearLoader.visible"
      :hide-overlay="false"
      persistent
      width="300"
    >
      <v-card
        color="#326DA8"
        dark
      >
        <v-card-text>
          {{dialogLinearLoader.message}}
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
export default {
  name: "mes-layout",
  data(vm) {
    return {
      drawer: vm.$vuetify.breakpoint.mdAndUp
    };
  },
  created() {
   /* debugger;
    this.$router.addRoutes([{
    path: '/tasks',
    component: getInternalComponentDescription(app.RootComponent),
  }, {path: '*', redirect: '/tasks'}])*/
  },
  computed: {
    currentUser() {
      return this.$store.getters.getCurrentUser;
    },
    snackbar() {
      return this.$store.getters["mes/snackbar"];
    },
    dialogLinearLoader() {
      return this.$store.getters["mes/dialogLinearLoader"];
    },
    linearLoader() {
      return this.$store.getters["mes/linearLoader"];
    },
    menuMiniMode() {
      return this.$store.getters["mes/menuMiniMode"];
    }
  },
  methods: {
    toggleMenuMode() {
      if (this.$vuetify.breakpoint.lg || this.$vuetify.breakpoint.xl) {
        this.$store.dispatch("mes/toggleMenuMiniMode")
      }
      else {
        this.drawer = !this.drawer;
      }
    },
    closeSnackbar() {
      this.$store.commit('mes/closeSnackbar');
    }
  }
};
</script>
<style type="text/css">
html{
  overflow-y: hidden;
}
body{
  overflow-y: hidden;
}
.main-block {
    padding: 0 !important;
    margin: 0 !important;
    max-width: 100%;
    height: 100%;
    overflow: hidden;
  }
.v-toolbar__extension {
  padding: 0;
}
.v-list__tile.v-list__tile--link.theme--light {
  padding-left: 28px;
}
.v-navigation-drawer--mini-variant .v-list__tile__action, .v-navigation-drawer--mini-variant .v-list__tile__avatar {
  justify-content: start !important;
}
</style>

