<template>
  <v-container  class="main-block">
    <v-card>
      <v-layout row xs12 md12 sm12 lg12>
        <v-flex xs4 md4 sm4 lg4 class="tasks-list">
          <mes-tasks-component 
            :selectedTask=selectedTask :tasks=tasks :initializeTasks=initializeTasks
            @changeCurrentTask="changeCurrentTask" />
        </v-flex>
        <v-flex xs8 md8 sm8 lg8 class="task-description">
            <v-layout column wrap xs12 md12 sm12 lg12>
              <v-flex class="button-toolbar" row wrap xs12 md12 sm12 lg12>
                <mes-tasks-toolbar v-if="Object.keys(selectedTask).length" 
                :layout=layout :selectedTask=selectedTask :installations=installations[selectedTask.workCenterCode]
                @layout="changeLayout" @removeAllInstallations=removeAllInstallations />
              </v-flex>
              <mes-task-main-layout :selectedTask=selectedTask
              v-if="(layout === 'mes-task-main-layout' && selectedTask.state == 'IN_PLAN') || (layout == 'mes-accept-task-layout' && selectedTask.state == 'IN_PLAN')" />
              <mes-accept-task-layout :selectedTask=selectedTask :formioData=productionFormio[selectedTask.workCenterCode]
              v-if="(layout == 'mes-accept-task-layout' && selectedTask.state == 'IN_WORK') ||(layout == 'mes-task-main-layout' && selectedTask.state == 'IN_WORK')" />
              <mes-task-stuff-layout :selectedTask=selectedTask :installations=installations
                @removeInstallation=removeInstallation v-if="layout == 'mes-task-stuff-layout'" />
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
      layout: 'mes-task-main-layout',
      selectedTask: {},
      initializeTasks: false
    };
  },
  created() {
    this.initialize();
  },
  computed: {
    installations() {
      return this.$store.getters['mes/installations'];
    },
    tasks() {
      return this.$store.getters['mes/tasks'];
    },
    workCenters() {
      return this.$store.getters['mes/workCenters'];
    },
    productionFormio() {
      return this.$store.getters['mes/productionFormio'];
    }
  },
  methods: {
    async initialize() {
      await this.$store.dispatch('mes/initializeWorkCenters');
      this.initializeInstallations();
      await this.$store.dispatch('mes/initializeTasks', this.workCenters);
      this.initializeTasks = true;
      var tasks = this.tasks;

      if(this.workCenters.length) {
        let workCenter = this.workCenters[0],
          tasksByWorkCenter = this.tasks[workCenter.code];
        if(tasksByWorkCenter && tasksByWorkCenter.length) {
          this.changeCurrentTask(tasksByWorkCenter[0]);
        }
      }
    },
    async initializeWorkCenters(uuid, login) {
      await this.$store.dispatch('mes/initializeWorkCenters', {uuid});
    },
    changeLayout(newLayout) {
      this.layout = newLayout;
    },
    changeCurrentTask(newSelectedTask) {
      if(newSelectedTask.shiftTaskId == this.selectedTask.shiftTaskId) {
        return;
      }
      this.selectedTask = newSelectedTask;
      this.$store.dispatch('mes/createProductionFormio', newSelectedTask.workCenterCode);
      switch(newSelectedTask.state) {
        case 'DONE':
          this.layout = '';
          break;
      }
    },
    removeAllInstallations() {
      var me = this;
      Object.keys(me.installations).forEach(workCenterCode => {
        var installationsByWorkCenters = me.installations[workCenterCode];
        installationsByWorkCenters.forEach(installation => {
          me.removeInstallation({ installation, workCenterCode });
        });
      });
    },
    removeInstallation({ installation, workCenterCode }) {
      this.$store.dispatch('mes/removeInstallation', { installation, workCenterCode });
    },
    initializeInstallations() {
      this.$store.dispatch('mes/initializeInstallations', this.workCenters);
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
