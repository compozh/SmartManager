<template>
<v-layout class="task-main-layout-block">
  <mes-task-main-layout-toolbar 
    @changeDowntimesOverlayVisible=changeDowntimesOverlayVisible
    @changeTaskTableView=changeTaskTableView
  />

     <v-layout class="mes-task-main-layout">
        <v-flex class="mes-task-main-flex" :key="this.productionFormioKey">
          <formio-form-component
            ref="formioFormComponent"

            @formSubmit=formSubmit
            @signalRConnect=signalRConnect
            @signalRDisconnect=signalRDisconnect
            @signalRSendMessage=signalRSendMessage
            @signalRSendMessageToAll=signalRSendMessageToAll
            @signalrROnRecieveMessage=signalrROnRecieveMessage
            @signalrROffRecieveMessage=signalrROffRecieveMessage

            :formDefinition=productionFormio
            :formCode=workCenter.productionRegistrationFormCode
            :instance=selectedTask
          />
        </v-flex>
    </v-layout>

  </v-layout>
</template>

<script>
import { events } from '../../../constants'
import { eventBus } from '../../../main'
import IotSignalRService from '../../components/IotSignalRService'

export default {
  name: 'mes-task-main-layout',
  data() {
    return {
      productionFormioKey: 0
    }
  },
  watch: {
    productionFormio() {
      this.signalRDisconnect()
    }
  },
  mounted() {
    eventBus.$on(events.workCenterChanged, this.workCenterChanged)
  },
  computed: {
    dragResizeMode() {
      return this.$store.getters['mes/dragResizeMode']
    },
    selectedTask() {
      return this.$store.getters['mes/selectedTask']
    },
    workCenter() {
      return this.$store.getters['mes/workCenter']
    },
    productionFormio() {
      this.productionFormioKey++
      return this.$store.getters['mes/productionFormio']
    },
    iotSettings() {
      return this.$store.getters['mes/iotSettings']
    }
  },
  methods: {
    changeDowntimesOverlayVisible() {
      this.$emit('changeDowntimesOverlayVisible')
    },
    changeTaskTableView() {
      this.$emit('changeTaskTableView', true)
    },
    formSubmit({ submission, completeSubmissionCallback }) {
      this.$store.dispatch('mes/productionFormIoSubmit',
        {
          workCenter: this.workCenter,
          submission,
          task: this.selectedTask,
          message: this.$t('mes.dialogs.RegistrationProduction'),
          deviceSizeType: this.$vuetify.breakpoint.name
        }
      ).then(completeSubmissionCallback)
    },
    getFormioData() {
      return this.$refs.formioFormComponent.getFormSubmission()
    },
    async signalRConnect() {
      if(this.iotSettings.iotSignalRConnection) {
        return false
      }
      
      var thingId = this.workCenter.thingId
      this.iotSettings.iotSignalRConnection = new IotSignalRService(thingId)

      await this.$store.dispatch('mes/initializeIotSignalRUrl', { thingId })
      let iotSignalRUrl = this.iotSettings.iotSignalRUrl

      if(iotSignalRUrl) {
        this.iotSettings.iotSignalRConnection.connect(iotSignalRUrl)
      }
      
      return true
    },
    async signalRDisconnect(thingId) {
      let connection = this.iotSettings.iotSignalRConnection
      if(!connection || !connection.connected) {
        return
      }
      
      await connection.dispose(thingId || this.workCenter.thingId)
      this.iotSettings.iotSignalRConnection = null
    },
    signalRSendMessage(params) {
      let connection = this.iotSettings.iotSignalRConnection
      if(!connection || !connection.connected) {
        return
      }
      connection.sendMessage(params)
    },
    signalRSendMessageToAll(params) {
      let connection = this.iotSettings.iotSignalRConnection
      if(!connection || !connection.connected) {
        return
      }
      connection.sendMessageToAll(params)
    },
    async signalrROnRecieveMessage(params) {
      let connection = this.iotSettings.iotSignalRConnection
      if(!connection || !connection.connected) {
        var result = await this.signalRConnect()
        if(!result) {
          return
        }
      }
      
      this.iotSettings.iotSignalRConnection.onRecieveMessage(params)
    },
    signalrROffRecieveMessage(params) {
      let connection = this.iotSettings.iotSignalRConnection
      if(!connection || !connection.connected) {
        return
      }
      connection.offRecieveMessage(params)
    },
    workCenterChanged(workCenter) {
      this.signalRDisconnect(workCenter.thingId)
    }
  }
}
</script>

<style type="text/css" scoped>
  .mes-task-main-layout  .mes-task-main-flex{
    position: absolute;
    height: calc(100% - 60px);
    overflow-y: auto;
    width: 100%;
  }
  .mes-task-main-layout  .mes-task-main-flex::-webkit-scrollbar {
    background-color:#fff;
    width:16px
  }
  .mes-task-main-layout  .mes-task-main-flex::-webkit-scrollbar-track {
      background-color:#fff
  }
  .mes-task-main-layout  .mes-task-main-flex::-webkit-scrollbar-track:hover {
      background-color:#f4f4f4
  }

  /* scrollbar itself */
 .mes-task-main-layout  .mes-task-main-flex::-webkit-scrollbar-thumb {
      background-color:#babac0;
      border-radius:16px;
      border:5px solid #fff
  }
  .mes-task-main-layout  .mes-task-main-flex::-webkit-scrollbar-thumb:hover {
      background-color:#a0a0a5;
      border:4px solid #f4f4f4
  }

  /* set button(top and bottom of the scrollbar) */
  .mes-task-main-layout  .mes-task-main-flex::-webkit-scrollbar-button {display:none}
  .main-layout {
    padding: 0 10px !important;
  }
  .task-main-layout-block {
    display: block;
    width: 100%;
  }
</style>
