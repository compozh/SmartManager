<template>
  <v-container class="main-block">
    <v-card ref="card">
      <vue-split
        class="main-block-layout"
        :elements="[
          '#slotOne',
          '#slotTwo'
        ]"
        direction="horizontal"
        :min-size="100"
        :gutter-size="0"
        :snap-offset="50"
        :sizes=aspectRatioLayout
        @onDragEnd="changeAspectRatioLayout"
      >
        <mes-dialog-component
          :title=dialogProperties.title
          :message=dialogProperties.message
          :agreeMessage=dialogProperties.agreeMessage
          :disagreeMessage=dialogProperties.disagreeMessage
          :visible=dialogProperties.visible
          @dialogInput=dialogInput
          @agreeClick=dialogAgreeClick
          @disagreeClick=dialogDisagreeClick />

          <mes-tasks-component
          id="slotOne"
          ref="taskList"
            :initializeTasks=initializeTasks
            :selectedTasksTab=selectedTasksTab
            @changeCurrentTask=onChangeCurrentTask
            @changeSelectTasksTab=changeSelectTasksTab />

            <v-layout column class="task-description-layout" id="slotTwo">
              <mes-task-main-layout
                v-if="selectedTask && ((currentLayout === 'main' && !selectedTask.inProgress)
                  || (currentLayout == 'inProgress' && !selectedTask.inProgress))" />

              <mes-task-in-progress-layout
                ref="taskInProgressLayout"
                v-if="selectedTask && ((currentLayout == 'inProgress' && selectedTask.inProgress)
                  ||(currentLayout == 'main' && selectedTask.inProgress))" />

              <mes-task-installations-layout
                v-if="selectedTask && currentLayout == 'installations'" />

            </v-layout>
      </vue-split>
    </v-card>
  </v-container>
</template>

<script>
import {mapGetters, install} from 'vuex'
import VueSplit from 'vue-splitjs'

export default {
  name: "mes-tasks",
  components: { VueSplit },
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
      },
    };
  },
  created() {
    this.initializeSignalR();
    this.initialize();
  },
  mounted() {
    if(this.initialWorkCenter && this.workCenter.accessPages == 'ONLY_INSTALLATION') {
      this.$router.replace({path: '/MES/installations'});
      return;
    }
  },
  computed: {
    initialWorkCenter() {
      return this.$store.getters["mes/initialWorkCenter"];
    },
    selectedTask: {
      get() {
        return this.tasksPageState.selectedTask;
      },
      set(selectedTask) {
        this.$store.commit('mes/setSelectedTask', selectedTask);
      }
    },
    aspectRatioLayout:{
      get() {
        return this.tasksPageState.aspectRatioLayout;
      },
      set(aspectRatioLayout) {
        this.$store.commit('mes/setAspectRatioLayout', aspectRatioLayout);
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
    tasks() {
      return this.$store.getters['mes/tasks'];
    },
    workCenter() {
      return this.$store.getters['mes/workCenter'];
    },
    ticket() {
      return this.$store.getters['mes/ticket'];
    },
    productionFormio() {
			return this.$store.getters['mes/productionFormio'];
		}
  },
  methods: {
    async initializeSignalR() {
      await this.$store.dispatch('mes/initializeTicket');
      this.$signalR.connect("HUBBER", window.myConfig.SignalRUrl, this.taskStateChanged, this.ticket);
    },
    taskStateChanged(msg) {
      let data = JSON.parse(msg);
      if(!data) {
        return;
      }

      switch(data.Payload.Action) {
        case "TaskStateChanged":
          let workCenters = data.Payload.Payload["WORKCENTERCODES"];
          if(!workCenters) {
            return;
          }

          workCenters = workCenters.includes(',') ? workCenters.trim().split(',') : [workCenters];
          if(workCenters.indexOf(this.workCenter.code)) {
            this.$store.dispatch('mes/setObsoluteDataTask', true);
          }
        break;
      }
    },
    async initialize() {
      await this.$store.dispatch('mes/initializeWorkCenter');
      await this.$store.dispatch('mes/initializeTasks', { workCenterCode: this.workCenter.code });
      this.initializeTasks = true;
      if(!this.selectedTask) {
        this.selectFirstTaskByTabIndex(this.tasksPageState.selectedTasksTab);
      }
    },
    selectFirstTaskByTabIndex(tabIndex) {
        for(let task of this.tasks) {
          switch(tabIndex) {
            case 0:
              if(task.state == "IN_PLAN" || task.state == "IN_WORK") {
                this.onChangeCurrentTask(task);
                return;
              }
              break;
            case 1:
              if(task.state == "DONE") {
                this.onChangeCurrentTask(task);
                return;
              }
              break;
          }
        }
    },
    changeCurrentLayout(currentLayout) {
      this.currentLayout = currentLayout;
    },
    onChangeCurrentTask(newSelectedTask) {
      if(this.selectedTask && newSelectedTask.shiftTaskId == this.selectedTask.shiftTaskId) {
        return;
      }

      if(this.$refs.taskInProgressLayout && !this.dialogProperties.task) {
        let currentFormioData = this.$refs.taskInProgressLayout.getFormioData();

        if(this.productionFormio && this.checkChangeFormioData(this.productionFormio.data, currentFormioData)) {
          this.dialogProperties.visible = true;
          this.dialogProperties.task = newSelectedTask;
          return;
        }
      }
      this.changeCurrentTask(newSelectedTask);
    },
    checkChangeFormioData(initialDataJson, currentDataJson) {
      let initialData = JSON.parse(initialDataJson),
        currentData = JSON.parse(currentDataJson);

        for(let key of Object.keys(currentData)) {
          let initialValue = initialData[key];
          let value = currentData[key];
          if(initialValue) {
            if(initialValue != value) {
              return true;
            }
          } else if(!Array.isArray(value) && typeof(value) != "object" && value) {
            return true;
          }
        }
      return false;
    },
    changeCurrentTask(newSelectedTask) {
      this.selectedTask = newSelectedTask;

      this.$store.commit('mes/resetProductionFormio');
      if(newSelectedTask.inProgress) {
        this.initializeFormio(newSelectedTask);
      }
      this.changeCurrentLayout('main');
    },
    initializeFormio(task) {
      let workCenter = this.workCenter,
        properties = {
          workCenterCode: workCenter.code,
          workBarcode: task.barcode
        };
      this.$store.dispatch('mes/createProductionFormio', { formCode: workCenter.productionRegistrationFormCode, properties });
    },
    changeSelectTasksTab(tabIndex) {
      this.selectedTasksTab = tabIndex;
      this.selectFirstTaskByTabIndex(tabIndex);
    },
    dialogAgreeClick() {
      this.dialogProperties.visible = false;
      this.changeCurrentTask(this.dialogProperties.task);
      this.dialogProperties.task = null;
    },
    dialogDisagreeClick() {
      this.dialogProperties.visible = false;
      this.dialogProperties.task = null;
    },
    dialogInput() {
      this.dialogProperties.visible = false;
      this.dialogProperties.task = null;
    },
    getFormioData() {
      return this.$refs.acceptTaskLayout.getFormioData();
    },
    async submitQrCode(code) {
      await this.$store.dispatch('mes/registerMaterialInstallation', { workCenterCode: this.workCenter.code, batchBarcode: code, factId: 0 });
    },
    changeAspectRatioLayout() {
      var taskListElementWidth =  this.$refs.taskList.$el.style.width,
      sizes = [],
      taskListElementWidth = parseFloat(taskListElementWidth.replace('calc(', '').replace('% - 0px)', '')),
      taskDescriptionElementWidth = 100 - taskListElementWidth;
      sizes.push(taskListElementWidth);
      sizes.push(taskDescriptionElementWidth);
      this.aspectRatioLayout = sizes;
    },
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
    border-left: 1px solid rgba(2, 2, 2, 0.08) !important;
    height: 100%;
  }
</style>