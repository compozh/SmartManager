<template>
    <v-layout class="list-block">
    <v-flex>
      <v-card class="card"
      v-for="downtime in downtimes"
      :key="downtime.id"
      @click="onDowntimeClick(downtime.id)">
        <v-card-text>{{downtime.description}}</v-card-text>
      </v-card>
    </v-flex>
    </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  data () {
    return { downtimes: [] };
  },
  name: "mes-downtimes",

  computed:{

  },
    methods: {
      onDowntimeClick(data) {
      }
  }
}
</script>

<style type="text/css" scoped>
  .list-block {
    height: 94vh;
    overflow-y: auto;
  }
  .list-block .card {
    display: flex;
    flex-direction: column;
    margin: 20px;
    border-radius: 20px;
  }
</style> 
