<template>
  <v-container fluid pa-0 class="task-wrapper">
    <v-layout row wrap justify-center>
      <v-flex>
        <sm-task-details-item></sm-task-details-item>
      </v-flex>
      <v-flex
        xs12 mr-2
        v-if=parentTasks.length
        class="sub-task-headline blue-grey--text pa-1 ml-5"
      >{{ $t('sm.tasks.related').toUpperCase() }}:</v-flex>
      <v-flex
        xs12 ml-5 mr-2
        class="task-container"
        v-for="parentTask in parentTasks"
        :key="parentTask.id"
      >
        <sm-task-sub-task-item :sub-task="parentTask"></sm-task-sub-task-item>
      </v-flex>
      <v-flex
        xs12 mr-2
        v-if=subTasks.length
        class="sub-task-headline blue-grey--text pa-1 ml-5"
      >{{ $t('sm.tasks.subTasks').toUpperCase() }}:</v-flex>
      <v-flex
        xs12 ml-5 mr-2
        class="task-container"
        v-for="subTask in subTasks"
        :key="subTask.id"
      >
        <sm-task-sub-task-item :sub-task="subTask"></sm-task-sub-task-item>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'sm-task-tab-tasks',
  computed: {
    task() {
      return this.$store.state.sm.taskInfo
    },
    parentTasks() {
      return this.task ? this.task.parentTasks : []
    },
    subTasks() {
      return this.task ? this.task.childTasks : []
    }
  }
}
</script>

<style scoped>
  .task-wrapper {
    overflow: auto;
    height: 86vh;
  }

  .sub-task-headline {
    font-size: 11px;
    border-bottom: 3px double #b4d2f0;
  }

  ::-webkit-scrollbar {
    display: none;
  }
</style>
