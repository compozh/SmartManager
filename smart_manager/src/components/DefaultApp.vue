<template>
  <v-app>
    <v-navigation-drawer fixed app v-model="drawer"></v-navigation-drawer>
    <v-toolbar app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title><slot name="toolbarTitle">{{_toolbarTitle}}</slot></v-toolbar-title>
      <slot name="toolbar"></slot>
    </v-toolbar>
    <v-content>
      <v-container fluid >
        <slot></slot>
      </v-container>
    </v-content>
    <v-footer app inset>
      <slot name="footer"></slot>
    </v-footer>
  </v-app>
</template>
<script>
// @ is an alias to /src

export default {
  name: "default-app",
  data() {
    return {
      drawer: null
    };
  },
  computed:{
    _toolbarTitle(){
      
      if(this.toolbarTitle && this.toolbarTitle.indexOf("@@") == 0){
        
        var subRes = this.$store.state.appData;
        if(!subRes){
          return ""
        }
        var path= this.toolbarTitle.substr(2).split(".");
        for (const pathSegment of path) {
          subRes = subRes[pathSegment]
        }
        return subRes
      }
      return this.toolbarTitle || "Application" 
    }

  },
  props: ["toolbarTitle"]
};
</script>
