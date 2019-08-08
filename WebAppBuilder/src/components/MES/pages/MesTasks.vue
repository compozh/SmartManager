<template>
  <v-container  class="main-block">
    <v-card>
      <multipane class="main-block-layout">
          <mes-tasks-component :selectedTask=selectedTask :tasks=tasks :initializeTasks=initializeTasks :selectedTasksTab=selectedTasksTab
            @changeCurrentTask=changeCurrentTask @changeSelectTasksTab=changeSelectTasksTab />
        <multipane-resizer><v-icon class="resizer-icon">drag_handle</v-icon></multipane-resizer>
            <v-layout column class="task-description-layout">
              <v-flex class="button-toolbar" row wrap >
                <mes-tasks-toolbar v-if="selectedTask"
                :currentLayout=currentLayout :selectedTask=selectedTask :installations=installations[selectedTask.workCenterCode]
                @changeCurrentLayout="changeCurrentLayout" @removeAllInstallations=removeAllInstallations />
              </v-flex>
              <mes-task-main-layout :selectedTask=selectedTask
                v-if="selectedTask && ((currentLayout === 'mes-task-main-layout' && selectedTask.state == 'IN_PLAN')
                  || (currentLayout == 'mes-accept-task-layout' && selectedTask.state == 'IN_PLAN'))" />
              <mes-accept-task-layout :selectedTask=selectedTask :workCenters=workCenters :productionFormio=productionFormio
                v-if="selectedTask && ((currentLayout == 'mes-accept-task-layout' && selectedTask.state == 'IN_WORK')
                  ||(currentLayout == 'mes-task-main-layout' && selectedTask.state == 'IN_WORK'))" />
              <mes-task-stuff-layout :selectedTask=selectedTask :installations=installations
                @removeInstallation=removeInstallation v-if="selectedTask && currentLayout == 'mes-task-stuff-layout'" />
            </v-layout>
      </multipane>
    </v-card>
  </v-container>
</template>

<script>
import {mapGetters, install} from 'vuex'
import { Multipane, MultipaneResizer  } from '../../../../node_modules/vue-multipane'

export default {
  name: "mes-tasks",
  components: { Multipane, MultipaneResizer },
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
      var tasks = this.tasks,
        workCenterCodes = Object.keys(this.workCenters);

      if(workCenterCodes.length) {
        let workCenterCode = workCenterCodes[0],
          tasksByWorkCenter = this.tasks[workCenterCode];
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
      let workCenter = this.workCenters[newSelectedTask.workCenterCode];
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
    height: 100%;
  }
  .main-block .v-card {
    height: 100%;
  }
  .main-block-layout {
    height: 100%;
  }
  .multipane-resizer {
    display: flex;
    margin: 0 5px 0 -4px;
    user-select: none;
    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
  }
  .resizer-icon {
    user-select: none;
    transform: rotate(90deg);
    width: 10px;
    pointer-events: none;
    cursor: default;
  }
  .button-toolbar.row {
    margin: 0;
  }
  .task-description-layout {
    height: 100%;
  }
</style>
