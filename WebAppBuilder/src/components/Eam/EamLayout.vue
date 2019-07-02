<template>
  <v-app id="eam-app">
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
      <v-container fluid>
        <router-view/>
      </v-container>
    </v-content>
    <v-footer app inset>
      <slot name="footer"></slot>
    </v-footer>
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
  name: "eam-layout",
  data(vm) {
    return {
      drawer: vm.$vuetify.breakpoint.mdAndUp,
      mini: false
    };
  },
  computed: {
    error() {
      return this.$store.getters["eam/error"];
    },
    loading() {
      return this.$store.getters["eam/loading"];
    },
    menuMiniMode() {
      return this.$store.getters["eam/menuMiniMode"];
    }
  },
  methods: {      
      toggleMenuMode() {
        if (this.$vuetify.breakpoint.mdAndUp) {
          this.$store.dispatch("eam/toggleMenuMiniMode")
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
