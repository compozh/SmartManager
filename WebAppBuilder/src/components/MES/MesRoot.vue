<template>
  <div>{{helloString}} <div @click="onLoadClick">LOAD more!</div></div>
</template>
<script>
import {mapGetters} from 'vuex'

export default {
  name: "mes-root",
  created(){
    this.getProperties()
  },
  computed:{
    ...mapGetters({
        loading: 'mes/properties',
      }),
  },
    methods: {
    getProperties() {
      const loader = this.properties ? 'setLinearLoader' : 'setCircularLoader'
      this.$store.dispatch('mes/getProperties')
    }
  }
}
</script>

