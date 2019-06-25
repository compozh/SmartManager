<template>
  <v-container fluid pa-0>
    <v-layout row wrap justify-center>
      <v-flex>
        <sm-task-details-item :task="taskDetail"></sm-task-details-item>
      </v-flex>
      <v-flex
        xs12 mr-2
        v-if=subTasks.length
        class="sub-task-headline blue-grey--text pa-1 ml-5"
      >СВЯЗАННЫЕ ЗАДАЧИ:</v-flex>
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
    props: ['taskDetail'],
    computed: {
      subTasks() {
        return this.taskDetail ? this.taskDetail.childTasks : []
      }
    }
  }
</script>

<style scoped>
  .sub-task-headline {
    font-size: 11px;
    border-bottom: 3px double #b4d2f0;
  }
</style>