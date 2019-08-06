<template>
  <v-card>
    <v-layout column xs12 md12 sm12 lg12>
      <v-flex fill-height class="grid-tabs" xs12 md12 sm12 lg12>
          <v-tabs show-arrows >
            <v-tab :key=taskStatus.inPlan.id @click="changeStatus(taskStatus.inPlan.id)" class="toolbar-item">
              <v-badge color="#1976d2" overlap>
                  
                <template v-slot:badge>
                  <span>!</span>
                </template>
                              {{taskStatus.inPlan.name}}

              </v-badge>
            </v-tab>
            <v-tab :key=taskStatus.done.id @click="changeStatus(taskStatus.done.id)" class="toolbar-item">
              <v-badge color="#1976d2" overlap>
                <template v-slot:badge>
                  <span>!</span>
                </template>
                              {{taskStatus.done.name}}

              </v-badge>
            </v-tab>
          </v-tabs>
      </v-flex>
      <v-flex class="tasks-list-block">
          <div v-if="!initializeTasks" class="wait-for-data-block">
            <ContentLoader>
              <rect x="0" y="0" rx="3" ry="3" width="400" height="10" />
              <rect x="20" y="20" rx="3" ry="3" width="220" height="10" />
              <rect x="20" y="40" rx="3" ry="3" width="170" height="10" />
              <rect x="0" y="60" rx="3" ry="3" width="400" height="10" />
              <rect x="20" y="80" rx="3" ry="3" width="200" height="10" />
              <rect x="20" y="100" rx="3" ry="3" width="350" height="10" />
            </ContentLoader>
          </div>
          <div v-for="(tasksByWorkCenter, workCenter) in tasks" :key="workCenter">
          <v-card ripple class="task-item" v-for="task in tasksByWorkCenter" :key="task.id" @click="changeCurrentTask(task)">
            <div :class="task == selectedTask ? 'active-task-item' : 'inactive-task-item'" v-if="(currentStatus == taskStatus.inPlan.id && task.state == taskStatus.inWork.id) || currentStatus == task.state">
              <v-card-text>
                <span v-html="task.description"></span>
              </v-card-text>
            </div>
          </v-card>
          </div>
          <span v-if="initializeTasks && Object.keys(tasks).length == 0" class="lack-of-tasks-str">Задания отсутствуют</span>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import {mapGetters} from 'vuex'
import {ContentLoader} from '../../../../node_modules/vue-content-loader'

export default {
  name: "mes-tasks-component",
  components: {
    ContentLoader
  },
  data: function() {
    let taskStatus = {
        inPlan: {name:'В плане', id: 'IN_PLAN'},
        inWork: {name: 'В работе', id: 'IN_WORK'},
        done: {name:'Выполнено', id: 'DONE'} };
    return { taskStatus, currentStatus: 'IN_PLAN'};
  },
  props: {
    selectedTask: Object,
    tasks: Object,
    initializeTasks: Boolean
  },
  methods: {
    changeStatus(status) {
      this.currentStatus = status;
    },
    changeCurrentTask(newTask) {
      this.$emit('changeCurrentTask', newTask);
    }
  }
}
</script>

<style type="text/css" scoped>
.grid-tabs .v-badge {
  padding-right: 10px;
}
  .tasks-list-block {
    overflow: auto;
    height: 89vh;
  }
  .tasks-list-block .task-item{
    margin: 10px;
    border-radius: 10px;
    cursor: pointer;
  }
  .change-tasks-status-toolbar {
    padding-left: 5px;
  }
  .toolbar-item {
    margin: 0 10px;
  }
  .v-badge__badge {
    position: absolute !important;
    right: -20px !important; 
    top: -10 !important;
  }
  .active-task-item {
    background-color: #d5e5ff;
  }
  .lack-of-tasks-str {
    font-size: 1.5em;
    font-weight: 300;
    color: #3d83f7;
  }
  .wait-for-data-block {
    padding: 20px;
  }
  .grid-tabs {
    padding-left: 10px;
  }
</style>