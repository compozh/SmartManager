<template>
  <div id="app">
    <component :is="dynamicComponent"></component>
  </div>
</template>

<script>
import home from '@/components/DefaultApp.vue';
//import { setTimeout } from 'timers';

export default {
  data(){
    return {
      dynamicComponent:""
    }
  },
  components: {
    home,
  },
  created(){
    setTimeout(()=>{ this.dynamicComponent = "home" }, 1000)
    
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
