<template>
  <div id="app">
    <div v-if="loginStatus">
     <common-component :component="app"></common-component> 
     <v-btn @click="zzz" color="warning" style="position:absolute; top:30%; left:90%; z-index:1000">change</v-btn>
    </div>
     <div class="login" v-if="!loginStatus">
        <login ></login>
    </div>
  </div>

</template>

<script>

import appConfig from './app.js';
import appData from './app.data.js';
import appData1 from './app.data.1.js';
import login from "../src/components/Login.vue";

export default {
  components:{
    login
  },
  props: ["toolbarTitle"],
  data(){
    return {
      app:undefined,
    }
  },
  computed:{
    controls:function(){
      return this.$store.state.test
    },
    loginStatus:function(){
      return this.$store.getters.getLoginStatus
    }
  },
  created(){
    setTimeout(()=>{ this.app = appConfig }, 0)
    setTimeout(()=>{ this.$store.commit('setAppData', appData) }, 0)
  },
  methods:{
    zzz(){
      if(this.controls){
        console.log('title = ',this.controls.props.toolbarTitle)
      setTimeout(()=>{ this.app = this.controls }, 0)
      this.$store.commit('updateData', appData1) 
      }
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
.login{
  position: fixed;
  left: 45%;
  top: 30%;
}
</style>
