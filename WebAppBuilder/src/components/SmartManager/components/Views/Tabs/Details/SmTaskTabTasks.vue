<template>
  <v-container fluid pa-0 px-2>
    <v-layout row wrap justify-center>
      <v-flex>
        <sm-task-details-item :task="task"></sm-task-details-item>
      </v-flex>
      <v-flex
        xs12
        class="task-container"
        v-for="subTask in taskDetail.tasks"
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
    props: ['taskDetail']
  }
</script>

<style scoped>

</style>