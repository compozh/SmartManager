
<template>
  <v-app  id="inspire">
    <v-navigation-drawer fixed app v-model="drawer" >
      <mes-menu/>
    </v-navigation-drawer>
    <v-toolbar app color="#326DA8" dark>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>{{toolbarTitle}}</v-toolbar-title>
      <router-view name="toolbar"/>
      <v-spacer></v-spacer>
      <language-component/>
    </v-toolbar>
      <v-content>
        <mes-list/>
        <mes-container/>
        <router-view/>
      </v-content>
    <v-footer app inset>
      <slot name="footer"></slot>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name:"mes-layout",
  data() {
    return {
      drawer: false
    };
  },
  computed:{
  },
  props: ["toolbarTitle"]
}
</script>

<style>

</style>