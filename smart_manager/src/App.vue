<!--=========================================================
            TEMPLATE
=========================================================-->
<template>
  <div id="app">
    <ul>
      <li>
        <router-link to="/one">one</router-link>
      </li>
      <li>
        <router-link to="/two">two</router-link>
      </li>
      <li>
        <router-link to="/three">three</router-link>
      </li>
      <li>
        <router-link to="/four">four</router-link>
      </li>
    </ul>
    <router-view></router-view>
    <!-- <common-component :component="$store.state.appLayout"></common-component>   -->
  </div>
</template>

<!--=========================================================
            SCRIPT
=========================================================-->
<script>
export default {
  created() {
    // this.$store.dispatch("GetAppLayout");
    //this.$store.dispatch("GetAppData");
  }
};
</script>

<!--=========================================================
            STYLE
============================================================-->
<style lang="scss">
#app {
  font-family: "Roboto";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
