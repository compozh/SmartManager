<template>
  <div>
    <div>Рабочие центры</div>
    <v-container fluid pa-0>
      <v-layout column>
        <v-flex xs12 row>
          <v-list>
            <v-list-tile
              v-for="workCenter in workCenters"
              :key="workCenter.code">
              <span>{{workCenter.name}}</span>
            </v-list-tile>
          </v-list>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'

export default {
  name:"mes-menu",
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
    getWorkCenters(uuid, login) {
      const loader = this.shiftTasks ? 'setLinearLoader' : 'setCircularLoader'
      this.$store.dispatch('mes/getWorkCenters', {uuid, loader})
    }
  }
}
</script>