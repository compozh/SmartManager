<template >
  <div fill-height>
    <h1>Задачи</h1>

    <!-- {{tasks}}  -->
    <v-flex>
      <v-flex v-for="task in tasks" :key="task.id" pt-3>
        <v-card pa-3>
          <!-- <v-list-tile-action>
                <v-icon>list</v-icon>
          </v-list-tile-action>-->

          <v-list-tile-content>
            <v-list-tile-title>Идентификатор: {{task.id}}</v-list-tile-title>
            <v-list-tile-title>Название задчи: {{task.name}}</v-list-tile-title>
            <v-list-tile-title>Имя: {{task.addedFio}}</v-list-tile-title>
            <v-list-tile-title>Дата добавления: {{task.dateadd}}</v-list-tile-title>
          </v-list-tile-content>
        </v-card>
      </v-flex>
    </v-flex>
  </div>
</template>


<script>
export default {
  name: "sm-tasks",

  props: ["tasks"]
};
</script>
<style>
</style>