<template>
  <v-app class="root">
    <v-content>
      <v-container fluid >
        <router-view/>
      </v-container>
    </v-content>
    <v-footer>
      <span class="pwb">POWERED BY</span> <svgLogo class="svg-logo"></svgLogo>
    </v-footer>
  </v-app>
</template>
<script>
import svgLogo from './it-logo-color.svg'

export default {
  components:{
    svgLogo
  },
  created(){
   let script = document.createElement("script")
   script.async = true
   script.src = myConfig.GrapgQlUrl+'Scripts/edswrapper.js'
   document.head.appendChild(script)
   script = document.createElement("script")
   script.async = true
   script.src = myConfig.GrapgQlUrl+'Scripts/bluebird.min.js'
   document.head.appendChild(script)
  },
  name:'minfin-layout'
}
</script>
<style>
  .root{
    background: #fff !important;
    /* background: linear-gradient(to left, #2196F3, #00BCD4) !important; */
    /* background: linear-gradient(217deg, #2096F3, rgba(0, 0, 0, 0) 70.71%),
                linear-gradient(127deg, #00BCD4, rgba(0, 0, 0, 0) 70.71%),
                linear-gradient(336deg, #6ff9ec, rgba(0, 0, 0, 0) 70.71%) !important; */
  }
  .svg-logo{
    height: 65%;
  }
  .pwb{
    padding: 0px 10px;
    font-size: 0.85em;
  }
</style>

