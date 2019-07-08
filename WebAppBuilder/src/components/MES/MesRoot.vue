<template>
  <div>{{helloString}} <div @click="onLoadClick">LOAD!</div></div>
</template>
<script>
export default {
  name: "mes-root",

  data(){
    return {
      helloString:""
    }
  },

  created(){
  //  setTimeout("")
  },
  mounted(){

  },

  methods:{
    onLoadClick(){
      this.helloString = "TEST"
    }
  }
}
</script>

