<template>
<v-component>
  <v-layout>
  <v-flex>
    <v-card-text>Parapapapfsa</v-card-text>
  </v-flex>
  <v-flex>
    <v-card-text>Parapapapfsa</v-card-text>
  </v-flex>
  </v-layout>
<v-component>
</template>
<script>
import {mapGetters} from 'vuex'

export default {
  name: "mes-element",
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