<template>
  <v-container  class="main-block">
    <v-card>
      <multipane class="main-block-layout">
        <mes-dialog-component
          :title=dialogProperties.title
          :message=dialogProperties.message
          :agreeMessage=dialogProperties.agreeMessage
          :disagreeMessage=dialogProperties.disagreeMessage
          :visible=dialogProperties.visible
          @agreeClick=dialogAgreeClick
          @disagreeClick=dialogDisagreeClick />

          <mes-tasks-component
            :selectedTask=selectedTask
            :initializeTasks=initializeTasks
            :selectedTasksTab=selectedTasksTab
            @changeCurrentTask=changeCurrentTask
            @changeSelectTasksTab=changeSelectTasksTab />

            <multipane-resizer><v-icon class="resizer-icon">drag_handle</v-icon></multipane-resizer>

            <v-layout column class="task-description-layout">
              <v-flex class="button-toolbar" row wrap >

                <mes-tasks-toolbar v-if="selectedTask"
                  :currentLayout=currentLayout
                  :dragResizeMode=dragResizeMode
                  :selectedTask=selectedTask
                  :installations=installations[selectedTask.workCenterCode]
                  @changeDragResizeMode="changeDragResizeMode"
                  @changeCurrentLayout="changeCurrentLayout"
                  @removeAllInstallations=removeAllInstallations
                  @initializeInstallations=initializeInstallations />

              </v-flex>

              <mes-task-main-layout
                :selectedTask=selectedTask
                :dragResizeMode=dragResizeMode
                v-if="selectedTask && ((currentLayout === 'mes-task-main-layout' && !selectedTask.inProgress)
                  || (currentLayout == 'mes-accept-task-layout' && !selectedTask.inProgress))" />

              <mes-accept-task-layout              
                ref="acceptTaskLayout"
                :selectedTask=selectedTask
                :workCenters=workCenters
                :dragResizeMode=dragResizeMode
                v-if="selectedTask && ((currentLayout == 'mes-accept-task-layout' && selectedTask.inProgress)
                  ||(currentLayout == 'mes-task-main-layout' && selectedTask.inProgress))" />

              <mes-task-stuff-layout
                :selectedTask=selectedTask
                :installations=installations
                @removeInstallation=removeInstallation
                v-if="selectedTask && currentLayout == 'mes-task-stuff-layout'" />

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
      initializeTasks: false,
      dialogProperties: {
        title: "",
        message: "Вы действительно хотите перейти на другое задание?",
        agreeMessage: "Да",
        disagreeMessage: "Нет",
        visible: false,
        task: null
      }
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
    dragResizeMode() {
      return this.$store.getters['mes/dragResizeMode'];
    }
  },
  methods: {
    async initialize() {
      await this.$store.dispatch('mes/initializeWorkCenters');
      await this.$store.dispatch('mes/initializeTasks', { workCenterCodes: Object.keys(this.workCenters) });
      this.initializeTasks = true;
      if(!this.selectedTask) {
        this.selectFirstTaskByTabIndex(this.tasksPageState.selectedTasksTab);
      }
    },
    selectFirstTaskByTabIndex(tabIndex) {
      var me = this,
        tasks = me.tasks,
        workCenterCodes = Object.keys(this.tasks);

      for(let workCenterCode of workCenterCodes) {
        let tasksByWorkCenter = tasks[workCenterCode];
        for(let task of tasksByWorkCenter) {
          switch(tabIndex) {
            case 0:
              if(task.state == "IN_PLAN" || task.state == "IN_WORK") {
                me.changeCurrentTask(task);
                return;
              }
              break;
            case 1:
              if(task.state == "DONE") {
                me.changeCurrentTask(task);
                return;
              }
              break;
          }
        }
      }
    },
    changeCurrentLayout(currentLayout) {
      this.currentLayout = currentLayout;
    },
    changeCurrentTask(newSelectedTask) {
      if(this.selectedTask && newSelectedTask.shiftTaskId == this.selectedTask.shiftTaskId) {
        return;
      }
      
      if(this.$refs.acceptTaskLayout && !this.dialogProperties.task) {
        let formioInitialData = this.$refs.acceptTaskLayout.getInitialFormioData(),
          currentFormioData = this.$refs.acceptTaskLayout.getFormioData();
          
        if(formioInitialData.data != currentFormioData) {
          this.dialogProperties.visible = true;
          this.dialogProperties.task = newSelectedTask;
          return;
        }
      }

      this.selectedTask = newSelectedTask;
      let workCenter = this.workCenters[newSelectedTask.workCenterCode];
      this.initializeFormioByWorkCenter(workCenter);
      this.changeCurrentLayout('mes-task-main-layout');
    },
    initializeFormioByWorkCenter(workCenter) {
      let properties = {
        workCenterCode: workCenter.code,
        workBarcode: this.selectedTask.barcode
      };
      this.$store.dispatch('mes/createProductionFormio', { formCode: workCenter.productionRegistrationFormCode, properties });
    },
    changeSelectTasksTab(tabIndex) {
      this.selectedTasksTab = tabIndex;
      this.selectFirstTaskByTabIndex(tabIndex);
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
      this.$store.dispatch('mes/initializeInstallations', { workCenterCodes: Object.keys(this.workCenters) });
    },
    changeDragResizeMode() {
      this.$store.dispatch('mes/changeDragResizeMode');
    },
    dialogAgreeClick() {
      this.dialogProperties.visible = false;
      this.changeCurrentTask(this.dialogProperties.task);
    },
    dialogDisagreeClick() {
      this.dialogProperties.visible = false;
    },
    getFormioData() {
      return this.$refs.acceptTaskLayout.getFormioData();
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
  .button-toolbar {
    display: flex;
    align-items: center;
    max-height: 60px;
    display: flex;
    align-items: center;
  }
  .button-toolbar.row {
    margin: 0;
    padding: 0 10px;
  }
  .task-description-layout {
    height: 100%;
  }
</style>
