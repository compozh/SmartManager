<template>
  <v-app id="mes-app">
    <v-navigation-drawer v-if="currentUser" app clipped hide-overlay :mini-variant="menuMiniMode && this.$vuetify.breakpoint.mdAndUp" v-model="drawer">
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
    <template v-if="error">
      <v-snackbar
        :multi-line="true"
        :timeout="5000"
        color="error"
        @input="closeError"
        :value="true"
      >
        {{ error }}
        <v-btn flat dark @click.native="closeError"
        >Close
        </v-btn>
      </v-snackbar>
    </template>
  </v-app>
</template>
<script>
export default {
  name: "mes-layout",
  data(vm) {
    return {
      drawer: vm.$vuetify.breakpoint.mdAndUp,
      mini: false
    };
  },
  computed: {
    currentUser() {
      return this.$store.getters.getCurrentUser;
    },
    error() {
      return this.$store.getters["mes/error"];
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
        if (this.$vuetify.breakpoint.mdAndUp) {
          this.$store.dispatch("mes/toggleMenuMiniMode")
        }
        else {
          this.drawer = !this.drawer;
        }
      },
      closeError() {
        this.$store.dispatch('mes/setError');
      }
    },
};
</script>
<style type="text/css">
html{
  overflow-y: hidden;
}
.main-block {
    padding: 0 !important;
    margin: 0 !important;
    max-width: 100%;
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

