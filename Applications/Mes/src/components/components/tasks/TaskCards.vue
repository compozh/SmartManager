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
        <v-icon v-if="task.inProgress" large class="inprogress-icon">play_arrow</v-icon>
          <v-card-text :class="task == selectedTask ? 'active-task-item' : 'inactive-task-item'">
            <span v-html="task.description"></span>
          </v-card-text>
          <v-progress-linear v-if="task.completionPercentage"
            color="#326DA8"
            height="25"
            :value="Math.round(task.completionPercentage)"
            reactive
          >
          {{Math.round(task.completionPercentage)}}%
          </v-progress-linear>
        </v-card>
      </div>
    </div>
  </v-flex>
</template>

<script>

export default {
  name: 'mes-task-cards',
  props: {
    selectedTask: Object,
    selectedTasksTab: Number
  },
  computed: {
    tasks() {
      return this.$store.getters['mes/tasks']
    },
    sortedTasks() {
      var tasks = this.tasks
      var tasksInProgress = []
      var tasksIsNotInProgress = []
      var completeSortedTasks = []
      tasks.sort((a,b) => {
        return new Date(a.startDateTime).getTime() > new Date(b.startDateTime).getTime() ?
          1 : (new Date(a.startDateTime).getTime() == new Date(b.startDateTime).getTime() ? 0 : -1)
      })
      if (tasks.length) {
        for (var i = tasks.length - 1; i >= 0; i--) {
          var task = tasks[i]
          if (task.inProgress) {
            tasksInProgress.push(task)
          } else {
            tasksIsNotInProgress.push(task)
          }
        }
        completeSortedTasks = tasksInProgress.concat(tasksIsNotInProgress)
      }
      return completeSortedTasks
    }
  },
  methods: {
    changeCurrentTask(newTask) {
      this.$emit('changeCurrentTask', newTask)
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
  .tasks-list-blocks .task-item{
    margin: 5px 10px;
    cursor: pointer;
    text-align: center;
  }
  .inprogress-icon {
    position: absolute;
    left: 0;
    top: 0;
    color: rgba(7, 109, 0, 0.81);
  }
</style>
