<template>
    <v-layout  lg12 xs12 md12 sm12 show-arrows class="toolbar">
        <v-flex
            :class="inTasksTable? 'task-toolbar-basebuttons' : 'toolbar-basebuttons'"
        >
            <v-btn class="col-12 ma-0 " v-if="$vuetify.breakpoint.smAndDown && !inTasksTable" @click="changeTaskTableView" text outlined>{{ $t('mes.buttons.Close') }}</v-btn>
            <v-btn class="setup-installations-button" v-if="$vuetify.breakpoint.mdAndUp || inTasksTable" outlined @click="onclickSetupMaterial" color="#326DA8">{{this.$t('mes.buttons.SetupMaterial')}}</v-btn>

            <v-btn class="status-task-btn" v-if="selectedTask.isVisibleButtonToTakingTaskToWork && ($vuetify.breakpoint.mdAndUp  || inTasksTable)"
                outlined
                :loading="this.changeStatusLoader"
                :disabled="selectedTask.state == 'DONE'"
                :color="selectedTask.inProgress ? 'rgba(179, 2, 2, 0.81)' :  'rgba(7, 109, 0, 0.81)'"
                @click="changeStatusTask"
            >
                {{selectedTask.inProgress ? this.$t('mes.buttons.Pause') :  this.$t('mes.buttons.TakeToWork')}}
            </v-btn>

            <v-btn class="downtime-registration-button" v-if="$vuetify.breakpoint.mdAndUp" outlined @click="changeDowntimesOverlayVisible" color="rgba(179, 2, 2, 0.81)">{{this.$t('mes.buttons.Downtime')}}</v-btn>
        </v-flex>
    </v-layout>
</template>

<script>
// import {mapGetters} from 'vuex'

export default {
  name: 'mes-task-main-layout-toolbar',
  data() {
    return {
      changeStatusLoader: false
    }
  },
  props:{
    inTasksTable: {
      required: false,
      type: Boolean
    }
  },
  computed: {
    selectedTask() {
      return this.$store.getters['mes/selectedTask']
    },
    workCenter() {
      return this.$store.getters['mes/workCenter']
    },
    dragResizeMode: {
      get() {
        return this.$store.getters['mes/dragResizeMode']
      },
      set() {
        this.$store.dispatch('mes/changeDragResizeMode')
      }
    },
    downtimesOverlay: {
      get() {
        return this.$store.getters['mes/downtimesOverlay']
      },
      set() {
        this.$store.dispatch('mes/changeDowntimesOverlay')
      }
    }
  },
  methods: {
    onclickSetupMaterial() {
      this.$store.commit('mes/setCurrentLayout', 'installations')
    },
    async changeStatusTask() {
      this.changeStatusLoader = true
      if (this.selectedTask.inProgress) {
        await this.$store.dispatch('mes/cancelBeginRegistration', { workCenter: this.workCenter, task: this.selectedTask, deviceSizeType: this.$vuetify.breakpoint.name })
        this.changeStatusLoader = false
        return
      }
      await this.$store.dispatch('mes/registerProduction', { workCenter: this.workCenter, task: this.selectedTask, deviceSizeType: this.$vuetify.breakpoint.name })
      this.changeStatusLoader = false
    },
    changeDragResizeMode (mode) {
      this.dragResizeMode = mode
      var splitter = document.getElementsByClassName('gutter gutter-horizontal')[0]
      if (!this.dragResizeMode) {
        splitter.style.cssText = 'width:0'
      } else {
        splitter.style.cssText = 'width: 5px'
      }
    },
    changeDowntimesOverlayVisible() {
      this.$emit('changeDowntimesOverlayVisible')
    },
    changeTaskTableView() {
      this.$emit('changeTaskTableView',true)
    }
  },
  created() {
    if(this.$vuetify.breakpoint.smAndDown){
      this.changeDragResizeMode(false)
    }
  }
}
</script>

<style type="text/css" scoped>
  .toolbar {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin: 0;
  }
  .toolbar .task-toolbar-basebuttonss {
    flex-direction: column !important;
    justify-content: flex-start;
    height: 100%;
    border-bottom: none;
  }
  .toolbar-basebuttons {
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    height: 63px;
    border-bottom: 1px solid rgba(2, 2, 2, 0.08);
  }
  .task-toolbar-basebuttons .v-btn {
    min-width: 95%;
  }
  .status-task-btn {
    border-radius: 5px;
  }
  .v-btn.v-btn--outlined {
    height: 50px;
  }
  .toolbar.row {
    margin: 0;
  }
  .drag-resize-button {
    min-width: auto;
    width: 50px;
    height: 50px;
    border-radius: 5px;
    border: 1px solid rgb(50, 109, 168);
  }
  .active-drag-resize-button {
    min-width: auto;
    width: 50px;
    height: 50px;
    border-radius: 5px;
    border: 1px solid rgb(50, 109, 168);
    background-color: rgba(50, 109, 168, 0.2) !important;
  }
  .setup-installations-button {
    border-radius: 5px;
  }
  .downtime-registration-button {
    border-radius: 5px;
    margin-left: auto;
  }
</style>
