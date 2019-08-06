<template>
  <v-card>
    <v-layout column xs12 md12 sm12 lg12>
      <v-flex fill-height class="grid-tabs" xs12 md12 sm12 lg12>
          <v-tabs show-arrows v-model="selectedTab">
                <v-tab v-for="tab in tabs" :key=tab.id @click="changeSelectTasksTab(tab.index)" class="toolbar-item">
                  <v-badge color="#1976d2" overlap>
                    <template v-slot:badge>
                      <span>!</span>
                    </template>
                    {{tab.name}}
                  </v-badge>
                </v-tab>
          </v-tabs>
      </v-flex>
      <v-flex class="tasks-list-block">
        <mes-content-loader :initialize=initializeTasks />
        <div v-for="(tasksByWorkCenter, workCenter) in tasks" :key="workCenter">
          <v-card ripple class="task-item" v-for="task in tasksByWorkCenter" :key="task.id" @click="changeCurrentTask(task)">
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
    return {tabs: [{index: 0, id: "PLAN", name: "В плане"}, { index: 1, id: "DONE", name: "Выполненные"}], selectedTab: this.selectedTasksTab}
  },
  props: {
    selectedTask: Object,
    tasks: Object,
    initializeTasks: Boolean,
    selectedTasksTab: Number
  },
  methods: {
    changeSelectTasksTab(tabIndex) {
      this.$emit('changeSelectTasksTab', tabIndex);
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