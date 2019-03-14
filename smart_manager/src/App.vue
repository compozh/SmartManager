<!--=========================================================
            TEMPLATE
=========================================================-->
<template>
  <div id="app">
     <common-component :component="$store.state.appLayout"></common-component> 
  </div>
</template>

<!--=========================================================
            SCRIPT
=========================================================-->
<script>
export default {
  created(){
    this.$store.dispatch('GetAppLayout');
    this.$store.dispatch('GetAppData');
  }
};
</script>

<!--=========================================================
            STYLE
============================================================-->
<style lang="scss">
#app {
  font-family: 'Roboto';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
