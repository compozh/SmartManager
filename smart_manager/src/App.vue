<!--=========================================================
            TEMPLATE
=========================================================-->
<template>
  <div id="app">
    <div class="one">
      <ul>
        <li>
          <router-link to="/one">one</router-link>
        </li>
        <li>
          <router-link to="/two">two</router-link>
        </li>
      </ul>
    </div>
    <router-view></router-view>
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
.one {
  position: fixed;
  right: 20px;
  top: 10px;
  z-index: 999;
}
</style>
