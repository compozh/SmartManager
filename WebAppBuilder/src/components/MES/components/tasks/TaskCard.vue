<template>
  <v-flex class="tasks-list-block">          
    <div v-for="task in sortedTasks" :key="task.shiftTaskId">

      <div 
        v-if="(selectedTasksTab == 0 && (task.state == 'IN_PLAN' || task.state == 'IN_WORK'))
        || (selectedTasksTab == 1 && task.state == 'DONE')"
      >

        <v-card ripple
          class="task-item"
          @click="changeCurrentTask(task)"
        >
          <v-card-text :class="task == selectedTask ? 'active-task-item' : 'inactive-task-item'">
            <span v-html="task.description"></span>
          </v-card-text>

        </v-card>
      </div>
    </div>
  </v-flex>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: "mes-task-card",
  computed: {
     tasks() {
      return this.$store.getters['mes/tasks'];
    },
    sortedTasks() {
      let tasks = [],
        workCenterCodes = Object.keys(this.tasks);
      for(let workCenterCode of workCenterCodes) {
        let tasksByWorkCenter = this.tasks[workCenterCode];
        for(let task of tasksByWorkCenter) {
          tasks.push(task);
        }
      }
      //tasks.sort();

      return tasks;
    }
  },
  methods: {
    changeCurrentTask(newTask) {
      this.$emit('changeCurrentTask', newTask);
    },

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
    border-radius: 5px;
    cursor: pointer;
  }
  .tasks-list-block-content {
    height:calc(100% - 48px);
    overflow-y: auto;
    position: absolute;
    width: 100%;
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