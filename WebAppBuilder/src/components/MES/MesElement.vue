<template>
  <v-card>
    <v-card-text>Parapapapfsa</v-card-text>
  </v-card>
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

