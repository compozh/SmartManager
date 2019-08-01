<template>
<v-container  class="main-block">
  <v-card>
    <v-layout row>
      <v-flex xs4 class="tasks-list">
        <mes-tasks-component :selectedTask=selectedTask @changeCurrentTask="changeCurrentTask" />
      </v-flex>
      <v-flex xs8 class="task-description">
          <v-layout column wrap>
            <v-flex class="button-toolbar">
              <mes-tasks-toolbar :layout=layout :selectedTask=selectedTask @layout="changeLayout" />
            </v-flex>
            <mes-task-main-layout :selectedTask=selectedTask v-if="layout === 'mes-task-main-layout'" />
            <mes-accept-task-layout :selectedTask=selectedTask v-if="layout == 'mes-accept-task-layout'" />
            <mes-task-defect-layout :selectedTask=selectedTask v-if="layout == 'mes-task-defect-layout'" />
            <mes-task-setup-materials-layout :selectedTask=selectedTask v-if="layout == 'mes-task-setup-materials-layout'" />
          </v-layout>
      </v-flex>
    </v-layout>
    </v-card>
  </v-container>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: "mes-tasks",
  data: function() {
    return { 
        layout: '',
        selectedTask: {}
      };
  },
  methods: {
       changeLayout(newLayout) {
         this.layout = newLayout;
      },
      changeCurrentTask(newTask){
        this.selectedTask = newTask;
        this.layout = 'mes-task-main-layout';
      }
  }
}
</script>
<style type="text/css" scoped>
  .main-block {
    padding: 0 !important;
    margin: 0 !important;
  }
  /* .tasks-list{
overflow-y: scroll;
  } */
  /* .task-description{
    overflow-y: scroll;
  } */
</style>
