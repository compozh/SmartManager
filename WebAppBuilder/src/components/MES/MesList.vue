<template>
    <v-container fluid pa-0>
      <v-layout column>
        <v-flex xs12 row>
         <v-select
          :items="workCenters"
          item-text="name"
          item-value="name"
          label="Work Centers"
          persistent-hint
          return-object
          single-line
        ></v-select>
        </v-flex>
      </v-layout>
    </v-container>
</template>
<script>
import {mapGetters} from 'vuex'

export default {
  name:"mes-list",
  created(){
    this.getWorkCenters("","")
  },
  computed: {
    ...mapGetters({
        loading: 'mes/loading',
        workCenters: 'mes/workCenters'
      }),
      workCenters() {
        return this.$store.getters['mes/getWorkCenters']
      },
      checkWorkCenters() {
        return this.workCenters ? this.workCenters.length : 0
      }
  },
  methods: {
    // applyWorkCenter(){
    //   debugger;
    // },
    getWorkCenters(uuid, login) {
      const loader = this.shiftTasks ? 'setLinearLoader' : 'setCircularLoader'
      this.$store.dispatch('mes/getWorkCenters', {uuid, loader})
    }
  }
}
</script>