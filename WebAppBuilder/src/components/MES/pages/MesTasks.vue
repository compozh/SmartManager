<template>
<v-container  class="main-block">
  <v-card>
    <v-layout row xs12 md12 sm12 lg12>
      <v-flex xs4 md4 sm4 lg4 class="tasks-list">
        <mes-tasks-component :selectedTask=selectedTask @changeCurrentTask="changeCurrentTask" />
      </v-flex>
      <v-flex xs8 md8 sm8 lg8 class="task-description">
          <v-layout column wrap xs12 md12 sm12 lg12>
            <v-flex class="button-toolbar" row wrap xs12 md12 sm12 lg12>
              <mes-tasks-toolbar :layout=layout :selectedTask=selectedTask
              @layout="changeLayout" @removeAllIntallations=removeAllIntallations />
            </v-flex>
            <mes-task-main-layout :selectedTask=selectedTask v-if="layout === 'mes-task-main-layout'" />
            <mes-accept-task-layout :selectedTask=selectedTask v-if="layout == 'mes-accept-task-layout'" />
            <mes-task-setup-materials-layout :selectedTask=selectedTask :installations=installations @removeInstallation=removeInstallation v-if="layout == 'mes-task-setup-materials-layout'" />
          </v-layout>
      </v-flex>
    </v-layout>
    </v-card>
  </v-container>
</template>

<script>
import {mapGetters, install} from 'vuex'

export default {
  name: "mes-tasks",
  data: function() {
    return {
        layout: '',
        selectedTask: {}
      };
  },
  computed: {
        installations() {
            return this.$store.getters['mes/installations'];
        }
  },
  methods: {
       changeLayout(newLayout) {
         this.layout = newLayout;
      },
      changeCurrentTask(newSelectedTask) {
        let workCenter = this.selectedTask.workCenter;
        this.selectedTask = newSelectedTask;

        if(workCenter != newSelectedTask.workCenter)
        {
          this.updateInstallations();
        }
        switch(newSelectedTask.state) {
          case 'IN_PLAN':
            this.layout = 'mes-task-main-layout';
            break;
          case 'IN_WORK':
            this.layout = 'mes-accept-task-layout';
            break;
          case 'DONE':
            this.layout = '';
            break;
        }
      },
      removeAllIntallations() {
        var me = this;
        me.installations.forEach(installation => {
          me.removeInstallation(installation);
        });
      },
      removeInstallation(installation) {
        this.$store.dispatch('mes/removeInstallation', installation);
      },
      updateInstallations() {
        this.$store.dispatch('mes/setupInstallationsByWorkCenter', this.selectedTask.workCenter);
      }
  }
}
</script>
<style type="text/css" scoped>
  .main-block {
    padding: 0 !important;
    margin: 0 !important;
  }
  .button-toolbar.row {
    margin: 0;
  }
</style>
