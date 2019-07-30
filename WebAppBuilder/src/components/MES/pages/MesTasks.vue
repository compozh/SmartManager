<template>
<v-container  class="main-block">
    <v-layout row wrap >
      <v-flex xs4>
        <v-card>
          <v-layout column>
              <v-flex>
                <v-tabs fixed-tabs>
                  <v-tab
                    v-for="status in taskStatus"
                    :key="status.id"
                  >
                    {{status.name}}
                  </v-tab>
                </v-tabs>
              </v-flex>
            <v-flex class="scroll-y list-block">
              <v-card class="card"
              v-for="task in tasks"
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
        </v-card>
      </v-flex>
      <v-flex xs8>
        <v-card>
          <v-layout column wrap>
            <v-flex class="button-toolbar">
              <mes-tasks-toolbar/>
            </v-flex>
            <v-flex>
              <grid-layout
           :layout="layout"
            :col-num="12"
            :row-height="30"
            :is-draggable="true"
            :is-resizable="true"
            :is-mirrored="false"
            :vertical-compact="true"
            :margin="[10, 10]"
            :use-css-transforms="true"
    >

        <grid-item v-for="item in layout" :key="item.i"
                   :x="item.x"
                   :y="item.y"
                   :w="item.w"
                   :h="item.h"
                   :i="item.i"
                   class="grid-element">
            {{item.i}}
        </grid-item>
    </grid-layout>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>

</template>
<script>
import {mapGetters} from 'vuex'

export default {
  data () {
    var items = [
      {name: 'tasks-1', id:'task-1', data:{ startTime:'12 May 2019', endTime: '30 July 2019', status: 'closed' }},
      {name: 'tasks-2', id:'task-2', data:{ startTime:'12 May 2019', endTime: '28 September 2019', status: 'In Progress' }},
      {name: 'tasks-3', id:'task-3', data:{ startTime:'12 May 2019', endTime: '12 July 2019', status: 'closed' }},
      {name: 'tasks-4', id:'task-4', data:{ startTime:'12 May 2019', endTime: '15 September 2019', status: 'In Progress' }},
      {name: 'tasks-5', id:'task-5', data:{ startTime:'12 May 2019', endTime: '12 July 2019', status: 'closed' }},
      {name: 'tasks-6', id:'task-6', data:{ startTime:'12 May 2019', endTime: '23 July 2019', status: 'closed' }},
      {name: 'tasks-7', id:'task-7', data:{ startTime:'12 May 2019', endTime: '06 September 2019', status: 'In Progress' }},
      {name: 'tasks-8', id:'task-8', data:{ startTime:'12 May 2019', endTime: '05 July 2019', status: 'closed' }},
      {name: 'tasks-9', id:'task-9', data:{ startTime:'12 May 2019', endTime: '11 September 2019', status: 'In Progress' }},
    ];
    var layout = [
      {'x':0, 'y':0, 'w':4, 'h':4, 'i':'0'},
      {'x':4, 'y':0, 'w':4, 'h':4, 'i':'1'},
      {'x':8, 'y':0, 'w':4, 'h':4, 'i':'2'},
      {'x':0, 'y':0, 'w':4, 'h':4, 'i':'3'},
      {'x':4, 'y':0, 'w':4, 'h':4, 'i':'4'},
      {'x':8, 'y':0, 'w':4, 'h':4, 'i':'5'},
     ]
    var taskStatus = [
      {name:'In plan', id:'inPlanStatus'},
      {name:'Done', id:'doneStatus'}
    ]
    return {
      tasks: items,
      taskStatus: taskStatus,
      layout: layout
    }
  },
  name: "mes-tasks",

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
  .suchBlock{
    height:150px;
    margin: 10px;
  }
  .grid-element {
    background-color: cornflowerblue;
  }
  .main-block {
    height: 100%;
    padding: 0 !important;
    margin: 0 !important;
  }
</style>
