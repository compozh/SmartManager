<template>
  <div class="mes-tasks-component">
    <v-layout column class="mes-tasks-component-layout" scrollable>
      <v-flex fill-height class="grid-tabs">
          <v-tabs v-model="selectedTab">
            <v-tab v-for="tab in tabs" :key=tab.id @click="changeSelectTasksTab(tab.index)" class="toolbar-item">
              <v-badge color="#326DA8" overlap>
                <template v-slot:badge>
                  <span class="span-count-tasks">{{countTasks(tab.id).length}}</span>
                </template>
                {{tab.name}}
              </v-badge>
            </v-tab>
          </v-tabs>
        <v-btn flat icon @click="refreshTasks" @mousedown.stop  :loading="refreshingTasks">
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path :fill='obsoleteData.tasks ? "#009975" : "#326DA8"' d="M2 12C2 16.97 6.03 21 11 21C13.39 21 15.68 20.06 17.4 18.4L15.9 16.9C14.63 18.25 12.86 19 11 19C4.76 19 1.64 11.46 6.05 7.05C10.46 2.64 18 5.77 18 12H15L19 16H19.1L23 12H20C20 7.03 15.97 3 11 3C6.03 3 2 7.03 2 12Z" />
          </svg>
        </v-btn>
      </v-flex>
      <v-flex class="tasks-list-blocks">
        <mes-content-loader
          v-if="!initializeTasks && !Object.keys(tasks).length"
          :loaderType=loaderType />
        <div class="tasks-list-block-content">

          <div v-for="(tasksByWorkCenter, workCenter) in tasks"
          :key="workCenter"
          class="tasks-list-block">
          
          <div v-for="task in tasksByWorkCenter" :key="task.id">

            <div 
              v-if="(selectedTasksTab == 0 && (task.state == 'IN_PLAN' || task.state == 'IN_WORK'))
                || (selectedTasksTab == 1 && task.state == 'DONE')">

            <v-card ripple class="task-item"
              @click="changeCurrentTask(task)">
              <v-card-text :class="task == selectedTask ? 'active-task-item' : 'inactive-task-item'">
                <span v-html="task.description"></span>
              </v-card-text>
            </v-card>
            </div>
          </div>
          </div>
        </div>
          <span v-if="initializeTasks && !Object.keys(tasks).length" class="lack-of-tasks-str">Задания отсутствуют</span>
      </v-flex>
    </v-layout>
    </div>
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
      selectedTab: this.selectedTasksTab,
      refreshingTasks: false
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
    },
    obsoleteData() {
      return this.$store.getters['mes/obsoleteData'];
    },
    workCenters() {
      return this.$store.getters['mes/workCenters'];
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
    },
    refreshTasks() {
      this.refreshingTaskMethod();
    },
    async refreshingTaskMethod() {
      this.refreshingTasks = true;
      await this.$store.dispatch('mes/initializeTasks', { workCenterCodes: Object.keys(this.workCenters), fetchPolicy: 'network-only' });
      this.$store.dispatch('mes/setObsoluteDataTask', false);
      this.refreshingTasks = false;
    }
  }
}
</script>

<style type="text/css" scoped>
  .mes-tasks-component {
    height: 100%;
    width: 30%;
    min-width: 330px
  }
  .mes-tasks-component-layout {
    height: 100%;
  }
  .grid-tabs{
    flex: 0 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .grid-tabs .v-badge {
    padding-right: 10px;
  }
  .tasks-list-blocks .task-item{
    margin: 5px 10px;
    border-radius: 10px;
    cursor: pointer;
  }
  .tasks-list-block-content {
    height:calc(100% - 48px);
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
  .tasks-list-block {
    display: flex;
    width: 100%;
    flex-direction: column;
  }

  /* set button(top and bottom of the scrollbar) */
  .tasks-list-block-content::-webkit-scrollbar-button {display:none}

  .change-tasks-status-toolbar {
    padding-left: 5px;
  }
  .toolbar-item {
    margin: 0 10px;
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
    font-size: 13px;
    font-weight: 400;
  }
</style>