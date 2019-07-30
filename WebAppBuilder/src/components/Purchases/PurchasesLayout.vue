<template>
  <v-app  id="inspire">
    <v-navigation-drawer fixed app v-model="drawer" :mini-variant.sync="mini">
      <v-btn @click.stop="mini = !mini" icon flat>
        <v-icon v-text="mini ? 'chevron_right' : 'chevron_left'" />
      </v-btn>
      <purchase-menu :mini="mini" name="navigation-drawer"/>
    </v-navigation-drawer>
    <v-toolbar app color="white">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-show="showTitle">{{toolbarTitle}}</v-toolbar-title>
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
    <message-snackbar />
    <options-selector />
  </v-app>
</template>

<script>
// @ is an alias to /src
import IconLanguageComponent from "./components/IconLanguageComponent.vue"

export default {
  name: "default-app-purchases",
  data() {
    return {
      drawer: false,
      mini: false,
    };
  },
  components:{
    IconLanguageComponent
  },
  computed:{
    showTitle(){
       return this.$store.getters["purchases/showTitle"]
    }
  },
  props: ["toolbarTitle"],
  methods:{
    changeDrawer(){
      if (this.drawer && !this.mini)
      {
        this.mini = true;
      } 
      else  if (this.drawer && this.mini)
      {
        this.drawer = false;
      } 
      else if(!this.drawer)
      {
        this.mini = true;
        this.drawer = true;
      }
    }
  }
};
</script>
