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
        <span v-if="task.inProgress" class="inprogress-icon">В работе</span>
          <v-card-text :class="task == selectedTask ? 'active-task-item' : 'inactive-task-item'">
            <span v-html="task.description"></span>
          </v-card-text>

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
      let tasks = this.tasks
      tasks.sort((a,b) => {
        return new Date(a.startDateTime).getTime() > new Date(b.startDateTime).getTime() ?
          1 : (new Date(a.startDateTime).getTime() == new Date(b.startDateTime).getTime() ? 0 : -1)
      })

      return tasks
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
    left: 8px;
    top: 8px;
    font-size: 14px;
    text-transform: uppercase;
    font-weight: 600;
    color: rgba(7, 109, 0, 0.81);
  }
</style>
