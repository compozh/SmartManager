<template>
  <v-layout row lg12 xs12 md12 sm12 show-arrows class="toolbar">
    <v-flex
      class="toolbar-basebuttons"
      v-if="currentLayout == 'mes-accept-task-layout' || currentLayout == 'mes-task-main-layout'">

      <v-btn outlined @click="onclickSetupMaterial($event)">Установить материалы</v-btn>
      <v-btn class="status-task-btn"
      outlined
      :color="selectedTask.inProgress ? 'rgba(179, 2, 2, 0.81)' : 'rgba(7, 109, 0, 0.81)'"
      @click="onclickAccept">{{selectedTask.inProgress ? 'Приостановить' : 'Взять в работу'}}</v-btn>

    </v-flex>
      <v-flex grow class="mes-tasks-toolbar-qr"
      v-if="currentLayout === 'mes-task-stuff-layout'">
      <v-btn outlined class="mes-arrow-back" @click="backToMainLayout"><v-icon dark>arrow_back</v-icon></v-btn>
        <v-text-field
          class="qr-input"
          label="Укажите QR-партии материала для установки"
          required @keyup.enter="submitQrCode"
        ></v-text-field>
        <v-btn outlined class="mes-scan" @click="onclickScan"><v-icon dark>view_week</v-icon></v-btn>
      </v-flex>
   <v-flex class="setup-material-btn" xs2 v-if="currentLayout === 'mes-task-stuff-layout' && installations && Object.keys(installations).length">
     <v-btn outlined @click="onclickRemoveAllInstallations">Снять все партии</v-btn>
   </v-flex>
  </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: "mes-tasks-toolbar",
  props: {
    currentLayout: String,
    selectedTask: Object,
    installations: Array
  },
  methods: {
    onclickSetupMaterial(event) {
      this.$emit('changeCurrentLayout', 'mes-task-stuff-layout');
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
      this.$store.dispatch('mes/registerMaterialInstallation', { workCenterCode: this.selectedTask.workCenterCode, batchBarcode: event.target.value, factId: 0 });
    },
    backToMainLayout() {
      this.$emit('changeCurrentLayout', 'mes-task-main-layout');
    },
    onclickScan(event) {
    }
  }
}
</script>

<style type="text/css" scoped>
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-between;
  }
  .toolbar-basebuttons{
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
  }
  .status-task-btn {
    color: white;
  }
  .toolbar.row {
    margin: 0;
  }
  .qr-input{
    width: 400px;
    max-width: 400px;
    height: 55px;
  }
  .downtime-btn {
    width: 150px;
    max-width: 150px;
  }
  .setup-material-btn {
    display: flex;
    align-items: center;
    width: 200px;
    max-width: 200px;
  }
  .mes-tasks-toolbar-qr {
    display: flex;
    align-items: center;
  }
  .mes-scan {
    min-width: auto;
  }
  .mes-arrow-back {
    min-width: auto;
  }
</style>
