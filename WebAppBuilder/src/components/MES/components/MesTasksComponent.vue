<template>
  <v-card class="mes-tasks-component">
    <v-layout column class="mes-tasks-component-layout" scrollable>
      <v-flex fill-height class="grid-tabs">
          <v-tabs show-arrows v-model="selectedTab">
                <v-tab v-for="tab in tabs" :key=tab.id @click="changeSelectTasksTab(tab.index)" class="toolbar-item">
                  <v-badge color="#1976d2" overlap>
                    <template v-slot:badge>
                      <span class="span-count-tasks">{{countTasks(tab.id).length}}</span>
                    </template>
                    {{tab.name}}
                  </v-badge>
                </v-tab>
          </v-tabs>
      </v-flex>
      <v-flex class="tasks-list-block">
        <mes-content-loader
          :initialize=initializeTasks
          :loaderType=loaderType />
        
        <div v-for="(tasksByWorkCenter, workCenter) in tasks" 
          :key="workCenter"
          class="tasks-list-block-content">
          
          <v-card ripple class="task-item" v-for="task in tasksByWorkCenter" 
            :key="task.id"
            @click="changeCurrentTask(task)">
            
            <div :class="task == selectedTask ? 'active-task-item' : 'inactive-task-item'"
              v-if="(selectedTasksTab == 0 && (task.state == 'IN_PLAN' || task.state == 'IN_WORK'))
                || (selectedTasksTab == 1 && task.state == 'DONE')">

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
  data() {
    return {
      tabs: [
        { index: 0, id: "PLAN", name: "В плане"},
        { index: 1, id: "DONE", name: "Выполненные"}
      ],
      loaderType: "list",
      selectedTab: this.selectedTasksTab
    };
  },
  props: {
    selectedTask: Object,
    initializeTasks: Boolean,
    selectedTasksTab: Number
  },
  computed: {
     tasks() {
      return this.$store.getters['mes/tasks'];
    }
  },
  methods: {
    changeSelectTasksTab(tabIndex) {
      this.$emit('changeSelectTasksTab', tabIndex);
    },
    changeCurrentTask(newTask) {
      this.$emit('changeCurrentTask', newTask);
    },
    countTasks(tabId) {
      var me = this,
        tasks = [];
      Object.keys(me.tasks).forEach(workCenterCode => {
        var tasksByWorkCenter = me.tasks[workCenterCode];
        tasksByWorkCenter.forEach(task => {
          if((tabId == "PLAN" && (task.state == "IN_PLAN" || task.state == "IN_WORK")) || tabId == "DONE" && task.state == "DONE") {
            tasks.push(task);
          }
        });
      });
      return tasks;
    }
  }
}
</script>

<style type="text/css" scoped>
  .mes-tasks-component {
    height: 100%;
    width: 30%;
  }
  .mes-tasks-component-layout {
    height: 100%;
  }
  .grid-tabs{
    flex: 0 0
  }
  .grid-tabs .v-badge {
    padding-right: 10px;

  }
  .tasks-list-block .task-item{
    margin: 10px;
    border-radius: 10px;
    cursor: pointer;
  }
  .tasks-list-block-content {
    height: 100%;
    overflow-y: auto;
    position: absolute;
  }

  .tasks-list-block-content::-webkit-scrollbar {
    background-color:#fff;
    width:16px
  }

  /* background of the scrollbar except button or resizer */
  .tasks-list-block-content::-webkit-scrollbar-track {
      background-color:#fff
  }
  .tasks-list-block-content::-webkit-scrollbar-track:hover {
      background-color:#f4f4f4
  }

  /* scrollbar itself */
  .tasks-list-block-content::-webkit-scrollbar-thumb {
      background-color:#babac0;
      border-radius:16px;
      border:5px solid #fff
  }
  .tasks-list-block-content::-webkit-scrollbar-thumb:hover {
      background-color:#a0a0a5;
      border:4px solid #f4f4f4
  }

  /* set button(top and bottom of the scrollbar) */
  .tasks-list-block-content::-webkit-scrollbar-button {display:none}

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
  .span-count-tasks {
    font-size: 10px;
    font-weight: 400;
  }
</style>