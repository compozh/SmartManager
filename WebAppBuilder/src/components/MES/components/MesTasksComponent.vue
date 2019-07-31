<template>
  <v-card>
    <v-layout column >
        <v-flex fill-height class="progress-toolbar">
          <v-tabs fixed-tabs>
            <v-tab
            v-for="status in taskStatus"
            :key="status.id"
            @click="changeStatus(inProgressStatus)"
            >
              {{status.name}}
          </v-tab>
        </v-tabs>
      </v-flex>
      <v-flex class="scroll-y list-block"
      :style="'height:'+ parentHeight + 'px'"
        >
        <v-card class="card"
        v-for="task in tasks"
        :key="task.id"
        @click="onCardClick(task.id)"
        >
          <div v-if="inProgressStatus == task.data.status">
            <v-card-text>Task name: {{task.name}}</v-card-text>
            <v-card-text>Start time: {{task.data.startTime}}</v-card-text>
            <v-card-text>End time: {{task.data.endTime}}</v-card-text>
            <v-card-text>Status: {{task.data.status}}</v-card-text>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: "mes-tasks-component",
  data(){
    return {inProgressStatus: 'In Progress',  parentHeight: 0}
  },
  computed: {
    tasks(){
      return [
      {name: 'tasks-1', id:'task-1', data:{ startTime:'12 May 2019', endTime: '30 July 2019', status: 'closed' }},
      {name: 'tasks-2', id:'task-2', data:{ startTime:'12 May 2019', endTime: '28 September 2019', status: 'In Progress' }},
      {name: 'tasks-3', id:'task-3', data:{ startTime:'12 May 2019', endTime: '12 July 2019', status: 'closed' }},
      {name: 'tasks-4', id:'task-4', data:{ startTime:'12 May 2019', endTime: '15 September 2019', status: 'In Progress' }},
      {name: 'tasks-5', id:'task-5', data:{ startTime:'12 May 2019', endTime: '12 July 2019', status: 'closed' }},
      {name: 'tasks-6', id:'task-6', data:{ startTime:'12 May 2019', endTime: '23 July 2019', status: 'closed' }},
      {name: 'tasks-7', id:'task-7', data:{ startTime:'12 May 2019', endTime: '06 September 2019', status: 'In Progress' }},
      {name: 'tasks-8', id:'task-8', data:{ startTime:'12 May 2019', endTime: '05 July 2019', status: 'closed' }},
      {name: 'tasks-9', id:'task-9', data:{ startTime:'12 May 2019', endTime: '11 September 2019', status: 'In Progress' }},
    ]
    },
    taskStatus(){
      return [
      {name:'In plan', id:'inPlanStatus'},
      {name:'Done', id:'doneStatus'}
    ]
    },

  },
  methods:{
    changeStatus(status){
      this.inProgressStatus = status == 'In Progress' ? 'closed' : 'In Progress';
    },
  },
  mounted() {
      var toolbarContainerHeight = this.$el.getElementsByClassName('progress-toolbar')[0].offsetHeight,
          windowheight = this.$parent.$el.offsetParent.offsetHeight;
      this.parentHeight = windowheight - toolbarContainerHeight - 1;
    }
}
</script>

<style type="text/css" scoped>
  .main-block {
  }
  .progress-toolbar{
  }
  .list-block{
    overflow-y: scroll;
  }
  .list-block .card{
    margin: 10px;
    border-radius: 50px;
  }
</style>