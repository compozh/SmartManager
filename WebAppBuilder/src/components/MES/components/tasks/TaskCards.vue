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
  name: "mes-task-cards",
  props: {
    selectedTask: Object,
    selectedTasksTab: Number
  },
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
      debugger;
      tasks.sort((a,b) => {
        return a.factId < b.factId ? 1 : (a.factId == b.factId ? 0 : -1);
      });

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
  .tasks-list-block {
    display: flex;
    width: 100%;
    flex-direction: column;
  }
  .active-task-item {
    background-color: #d5e5ff;
  }
</style>