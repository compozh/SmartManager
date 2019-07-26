<template>
  <div v-on:click="onLoadClick">LOAD more!</div>
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
    onLoadClick(){
      console.log('LOAD more')
    },
    getProperties() {
      const loader = this.properties ? 'setLinearLoader' : 'setCircularLoader'
      this.$store.dispatch('mes/getProperties')
    }
  }
}
</script>
