<template>
  <v-app id="mes-app">
    <v-navigation-drawer app clipped hide-overlay :mini-variant="menuMiniMode && this.$vuetify.breakpoint.mdAndUp" v-model="drawer">
      <router-view name="navigation-drawer"/>
    </v-navigation-drawer>
    <v-toolbar app fixed clipped-left extended :extension-height="3">
      <v-toolbar-side-icon @click.stop="toggleMenuMode"></v-toolbar-side-icon>
      <router-view name="toolbar"/>
      <v-spacer></v-spacer>
      <!-- <language-component/> -->
      <v-progress-linear slot="extension" v-if="loading" :indeterminate="loading" ma-0 height="3"></v-progress-linear>
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
    error() {
      return this.$store.getters["mes/error"];
    },
    loading() {
      return this.$store.getters["mes/loading"];
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
        this.$store.dispatch('sm/clearError');
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
</style>

