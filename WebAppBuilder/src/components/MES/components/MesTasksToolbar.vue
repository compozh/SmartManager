<template>
  <v-layout row>
    <v-flex>
      <v-btn outlined>Set Materials</v-btn>
   </v-flex>
   <v-flex>
      <v-btn outlined color="error" >Stop</v-btn>
   </v-flex>
   <v-flex>
      <v-btn outlined color="error">Downtime</v-btn>
   </v-flex>
  </v-layout>
</template>
<script>
import {mapGetters} from 'vuex'

export default {
  data () {
    return {
      bottomNav: 'recent',
    }
  },
  name: "mes-tasks-toolbar",
}
</script>
<style type="text/css" scoped>

</style>
