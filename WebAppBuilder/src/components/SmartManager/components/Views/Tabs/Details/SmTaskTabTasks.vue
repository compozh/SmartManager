<template>
  <v-container fluid pa-0>
    <v-layout row wrap justify-center>
      <v-flex>
        <sm-task-details-item :task="taskDetail"></sm-task-details-item>
      </v-flex>
      <v-flex
        xs12
        class="task-container"
        v-for="subTask in subTasks"
        :key="subTask.id"
      >
        <sm-task-details-item :task="subTask"></sm-task-details-item>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: "smTaskTabTasks",
    props: ['taskDetail'],
    computed: {
      subTasks() {
        return this.taskDetail ? this.taskDetail.tasks : []
      }
    }
  }
</script>

<style scoped>

</style>