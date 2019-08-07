<template>
  <v-container  class="main-block">
    <v-card>
      <v-layout row xs12 md12 sm12 lg12>
        <v-flex xs4 md4 sm4 lg4 class="tasks-list">
          <mes-tasks-component :selectedTask=selectedTask :tasks=tasks :initializeTasks=initializeTasks :selectedTasksTab=selectedTasksTab
            @changeCurrentTask=changeCurrentTask @changeSelectTasksTab=changeSelectTasksTab />
        </v-flex>
        <v-flex xs8 md8 sm8 lg8 class="task-description">
            <v-layout column wrap xs12 md12 sm12 lg12>
              <v-flex class="button-toolbar" row wrap xs12 md12 sm12 lg12>
                <mes-tasks-toolbar v-if="selectedTask"
                :currentLayout=currentLayout :selectedTask=selectedTask :installations=installations[selectedTask.workCenterCode]
                @changeCurrentLayout="changeCurrentLayout" @removeAllInstallations=removeAllInstallations />
              </v-flex>
              <mes-task-main-layout :selectedTask=selectedTask
                v-if="selectedTask && ((currentLayout === 'mes-task-main-layout' && selectedTask.state == 'IN_PLAN')
                  || (currentLayout == 'mes-accept-task-layout' && selectedTask.state == 'IN_PLAN'))" />
              <mes-accept-task-layout :selectedTask=selectedTask :formioData=productionFormio[selectedTask.workCenterCode]
                v-if="selectedTask && ((currentLayout == 'mes-accept-task-layout' && selectedTask.state == 'IN_WORK')
                  ||(currentLayout == 'mes-task-main-layout' && selectedTask.state == 'IN_WORK'))" />
              <mes-task-stuff-layout :selectedTask=selectedTask :installations=installations
                @removeInstallation=removeInstallation v-if="selectedTask && currentLayout == 'mes-task-stuff-layout'" />
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
  data() {
    return {
      initializeTasks: false
    };
  },
  created() {
    this.initialize();
  },
  computed: {
    selectedTask: {
      get() {
        return this.tasksPageState.selectedTask;
      },
      set(selectedTask) {
        this.$store.commit('mes/setSelectedTask', selectedTask);
      }
    },
    currentLayout: {
      get() {
        return this.tasksPageState.currentLayout;
      },
      set(currentLayout) {
        this.$store.commit('mes/setCurrentLayout', currentLayout);
      }
    },
    selectedTasksTab: {
      get() {
        return this.tasksPageState.selectedTasksTab;
      },
      set(tabIndex) {
        this.$store.commit('mes/setSelectedTasksTab', tabIndex);
      }
    },
    tasksPageState() {
      return this.$store.getters['mes/tasksPageState'];
    },
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
      this.selectFirstTask();
    },
    selectFirstTask() {
      var tasks = this.tasks;

      if(this.workCenters.length) {
        let workCenter = this.workCenters[0],
          tasksByWorkCenter = this.tasks[workCenter.code];
        if(tasksByWorkCenter && tasksByWorkCenter.length) {
          this.changeCurrentTask(this.getFirstTaskInPlan(tasksByWorkCenter));
        }
      }
    },
    getFirstTaskInPlan(tasks) {
      var firstDoneTask = null;
      for(var i = 0; i < tasks.length; i++) {
        var task = tasks[i];
        if(task.state == "IN_PLAN" || task.state == "IN_WORK") {
          return task;
        }
        if(!firstDoneTask && task.state == "DONE") {
          firstDoneTask = task;
        }
      }
      return firstDoneTask;
    },
    async initializeWorkCenters(uuid, login) {
      await this.$store.dispatch('mes/initializeWorkCenters', {uuid});
    },
    changeCurrentLayout(currentLayout) {
      this.currentLayout = currentLayout;
    },
    changeCurrentTask(newSelectedTask) {
      if(this.selectedTask && newSelectedTask.shiftTaskId == this.selectedTask.shiftTaskId) {
        return;
      }
      this.selectedTask = newSelectedTask;
      let workCenter = this.getWorkCenterByCode(newSelectedTask.workCenterCode);
      this.$store.dispatch('mes/createProductionFormio', workCenter.productionRegistrationFormCode);
      switch(newSelectedTask.state) {
        case 'DONE':
          this.currentLayout = '';
          break;
        default:
          this.currentLayout = 'mes-task-main-layout';
          break;
      }
    },
    getWorkCenterByCode(workCenterCode) {
      var workCenters = this.workCenters;
      for(var i = 0; i < workCenters.length; i++) {
        let workCenter = workCenters[i];
        if(workCenter.code == workCenterCode) {
          return workCenter;
        }
      }
      return {};
    },
    changeSelectTasksTab(tabIndex) {
      this.selectedTasksTab = tabIndex;
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
