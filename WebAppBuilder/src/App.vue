<!--=========================================================
            TEMPLATE
=========================================================-->
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<!--=========================================================
            SCRIPT
=========================================================-->
<script>
export default {
  created() {

    // загрузка приложения
  //  this.$store.dispatch("GetApplication");

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
