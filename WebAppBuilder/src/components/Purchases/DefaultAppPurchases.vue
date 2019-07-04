<template>
  <v-app  id="inspire">
    <v-navigation-drawer fixed app v-model="drawer" >
      <router-view name="navigation-drawer"/>
    </v-navigation-drawer>
    <v-toolbar app color="cyan" dark>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>{{toolbarTitle}}</v-toolbar-title>
      <router-view name="toolbar"/>
      <elastic-search style="margin: 10px"/>
      <icon-language-component/>
    </v-toolbar>
    <v-content>
      <v-container fluid >
        <router-view/>
      </v-container>
    </v-content>
    <v-footer app inset>
      <slot name="footer"></slot>
    </v-footer>
  </v-app>
</template>

<script>
// @ is an alias to /src
import IconLanguageComponent from "./SimpleComponents/IconLanguageComponent.vue"

export default {
  name: "default-app-purchases",
  data() {
    return {
      drawer: false
    };
  },
  components:{
    IconLanguageComponent
  },
  computed:{
  },
  props: ["toolbarTitle"]
};
</script>
