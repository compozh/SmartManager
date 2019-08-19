<template>
  <v-layout row lg12 xs12 md12 sm12 show-arrows class="toolbar">
    <v-flex
      class="toolbar-basebuttons"
      v-if="currentLayout == 'mes-accept-task-layout' || currentLayout == 'mes-task-main-layout'"
    >

      <v-btn class="setup-installations-button" outlined @click="onclickSetupMaterial($event)" outline color="#326DA8">Установить материалы</v-btn>

      <v-btn class="status-task-btn"
        outlined
        outline
        :color="selectedTask.inProgress ? 'rgba(179, 2, 2, 0.81)' : 'rgba(7, 109, 0, 0.81)'"
        @click="onclickAccept"
      >
        {{selectedTask.inProgress ? 'Приостановить' : 'Взять в работу'}}
      </v-btn>

      <v-btn flat icon :class=" this.activeChangeDragResizeMode ? 'active-drag-resize-button' : 'drag-resize-button'" color="#326DA8" @click="changeDragResizeMode">
        <v-icon>aspect_ratio</v-icon>
      </v-btn>

    </v-flex>
      <v-flex grow
        class="mes-tasks-toolbar-qr"
        v-if="currentLayout === 'mes-task-installations-layout'"
      >

      <v-btn outlined class="mes-arrow-back" @click="backToMainLayout" outline color="#326DA8"><v-icon dark>arrow_back</v-icon></v-btn>
      <v-text-field
        class="qr-input"
        label="Укажите QR-партии материала для установки"
        required @keyup.enter="submitQrCode"
        v-model="inputQrCode"
        :disabled="this.disableQrInput"
      />

      <v-btn outlined class="mes-scan" @click="onClickQrScan" outline color="#326DA8" @mousedown.stop>
        <svg style="width:24px;height:24px" viewBox="0 0 24 24">
          <path fill="#326DA8" d="M4,4H10V10H4V4M20,4V10H14V4H20M14,15H16V13H14V11H16V13H18V11H20V13H18V15H20V18H18V20H16V18H13V20H11V16H14V15M16,15V18H18V15H16M4,20V14H10V20H4M6,6V8H8V6H6M16,6V8H18V6H16M6,16V18H8V16H6M4,11H6V13H4V11M9,11H13V15H11V13H9V11M11,6H13V10H11V6M2,2V6H0V2A2,2 0 0,1 2,0H6V2H2M22,0A2,2 0 0,1 24,2V6H22V2H18V0H22M2,18V22H6V24H2A2,2 0 0,1 0,22V18H2M22,22V18H24V22A2,2 0 0,1 22,24H18V22H22Z" />
        </svg>
      </v-btn>
      </v-flex>
   <v-flex class="remove-installations-layout" xs2 v-if="currentLayout === 'mes-task-installations-layout' && installations && Object.keys(installations).length">
     <v-btn class="remove-installations-button" outlined @click="onclickRemoveAllInstallations" outline color="#326DA8">Снять все партии</v-btn>
   </v-flex>
  </v-layout>
</template>
<script>
import {mapGetters} from 'vuex'

export default {
  data(){
    return {activeChangeDragResizeMode: false, inputQrCode: '', disableQrInput: false}
  },
  name: "mes-tasks-toolbar",
  props: {
    currentLayout: String,
    selectedTask: Object,
    installations: Array,
    dragResizeMode: Boolean
  },
  methods: {
    onclickSetupMaterial(event) {
      this.$emit('initInstallations');
      this.$emit('changeCurrentLayout', 'mes-task-installations-layout');
    },
    onclickAccept(event) {
      if(this.selectedTask.inProgress) {
        this.$store.dispatch('mes/cancelBeginRegistration', this.selectedTask);
      } else {
        this.$store.dispatch('mes/registerProduction', this.selectedTask);
      }
    },
    onclickRemoveAllInstallations() {
      this.$emit('removeAllInstallations');
    },
    submitQrCode(event) {
      var qrCodeValue = event.target.value;
      this.asyncSubmitQrCode(qrCodeValue);
    },
    async asyncSubmitQrCode(qrCodeValue) {
      this.disableQrInput = true;
      await this.$store.dispatch('mes/registerMaterialInstallation', { workCenterCode: this.selectedTask.workCenterCode, batchBarcode: qrCodeValue, factId: 0 });
      this.disableQrInput = false;
      this.inputQrCode = ''
    },
    backToMainLayout() {
      this.$emit('changeCurrentLayout', 'mes-task-main-layout');
    },
    onClickQrScan(event) {
      this.$emit('changeQrScanerVisible', true);
    },
    changeDragResizeMode (){
      this.activeChangeDragResizeMode = !this.activeChangeDragResizeMode;
      this.$emit('changeDragResizeMode');
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
  }
  .toolbar-basebuttons{
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    height: 60px;
    border-bottom: 1px solid rgba(2, 2, 2, 0.08);
  }
  .status-task-btn {
    color: white;
    border-radius: 5px;
  }
  .toolbar.row {
    margin: 0;
  }
  .qr-input{
    max-width: 400px;
    height: 55px;
  }
  .downtime-btn {
    width: 150px;
    max-width: 150px;
  }
  .remove-installations-layout {
    display: flex;
    align-items: center;
    width: 200px;
    max-width: 200px;
    border-bottom: 1px solid rgba(2, 2, 2, 0.08);
  }
  .remove-installations-button {
    border-radius: 5px;
  }
  .mes-tasks-toolbar-qr {
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(2, 2, 2, 0.08);
  }
  .mes-scan {
    min-width: auto;
    border-radius:5px;
  }
  .mes-arrow-back {
    min-width: auto;
    border-radius: 5px;
  }
  .drag-resize-button {
    margin-left: auto;
  }
  .active-drag-resize-button {
    margin-left: auto;
    background-color: rgba(50, 109, 168, 0.2);
  }
  .setup-installations-button {
    border-radius: 5px;
  }
</style>
