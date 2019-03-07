<template>
  <div id="app">

     <common-component :component="app"></common-component> 
     <v-btn @click="zzz" style="position:fixed; top:0; left:0; z-index:1000">TEST</v-btn>

  </div>
</template>

<script>

import appConfig from './app.js';
import appData from './app.data.js';
import appData1 from './app.data.1.js';

export default {
  data(){
    return {
      app:undefined
    }
  },
  created(){
    setTimeout(()=>{ this.app = appConfig }, 0)
    setTimeout(()=>{ this.$store.commit('setAppData', appData) }, 0)
  },
  methods:{
    zzz(){
      this.$store.commit('updateData', appData1) 
    }
  }
};
</script>


<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
