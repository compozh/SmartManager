
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
      <div class='userName'>Hello User</div>
      <v-btn large>Exit</v-btn>
    </v-toolbar>
      <v-content>
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
  methods:{
    // helloMsg(){
    //   debugger;
    // }
  },
  props: ["toolbarTitle"]
}
</script>

<style type="text/css" scoped>
  /* .userName {
    color: white
  } */
</style>

