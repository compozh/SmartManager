<template>
    <v-layout>
    <v-flex
      class="scroll-y list-block"
      >
      <v-card class="card"
      v-for="task in downtime"
      :key="task.id"
      @click="onCardClick(task.id)"
      >
        <v-card-text>Task name: {{task.name}}</v-card-text>
        <v-card-text>Start time: {{task.data.startTime}}</v-card-text>
        <v-card-text>End time: {{task.data.endTime}}</v-card-text>
        <v-card-text>Status: {{task.data.status}}</v-card-text>
      </v-card>


    </v-flex>
    </v-layout>
</template>
<script>
import {mapGetters} from 'vuex'

export default {
  data () {
    var downtime = [
      {name: 'downtime-1', id:'task-1', data:{ startTime:'12 May 2019', endTime: '30 July 2019', status: 'closed' }},
      {name: 'downtime-2', id:'task-2', data:{ startTime:'12 May 2019', endTime: '28 September 2019', status: 'In Progress' }},
      {name: 'downtime-3', id:'task-3', data:{ startTime:'12 May 2019', endTime: '12 July 2019', status: 'closed' }},
      {name: 'downtime-4', id:'task-4', data:{ startTime:'12 May 2019', endTime: '15 September 2019', status: 'In Progress' }},
      {name: 'downtime-5', id:'task-5', data:{ startTime:'12 May 2019', endTime: '12 July 2019', status: 'closed' }},
      {name: 'downtime-6', id:'task-6', data:{ startTime:'12 May 2019', endTime: '23 July 2019', status: 'closed' }},
      {name: 'downtime-7', id:'task-7', data:{ startTime:'12 May 2019', endTime: '06 September 2019', status: 'In Progress' }},
      {name: 'downtime-8', id:'task-8', data:{ startTime:'12 May 2019', endTime: '05 July 2019', status: 'closed' }},
      {name: 'downtime-9', id:'task-9', data:{ startTime:'12 May 2019', endTime: '11 September 2019', status: 'In Progress' }},
    ]
    return { downtime: downtime };
  },
  name: "downtimes",

  computed:{

  },
    methods: {
      onCardClick(data){
        console.log(data)
      },

  }
}
</script>
<style type="text/css" scoped>
  .list-block {
    /* width: 500px;
    max-width: 500px; */

  }
  .list-block .card {
    display: flex;
    flex-direction: column;
    /* width: 400px; */
    margin: 20px;
    border-radius: 20px;
  }
</style>
