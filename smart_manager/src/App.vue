<!--=========================================================
            TEMPLATE
=========================================================-->
<template>
  <div id="app">
     <common-component :component="app"></common-component> 
  </div>
</template>

<!--=========================================================
            SCRIPT
=========================================================-->
<script>
import appLayout from './mock/app.js';
import appData from './mock/app.data.js';
import appData1 from './mock/app.data.1.js';

export default {
  computed:{
    app(){
      return this.$store.state.appLayout;
    } 
  },
  created(){
    setTimeout(()=>{ this.$store.commit('setAppLayout', appLayout) }, 1)
    setTimeout(()=>{ this.$store.commit('setAppData', appData) }, 1)
  },
  methods:{
    zzz(){
      this.$store.commit('updateData', [{"op":"add", "path":"/Data/1", "value":{"Caption":"zzzz",Done:true}}]) 
      this.$store.commit('updateData',[appData1]) 
    }
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
