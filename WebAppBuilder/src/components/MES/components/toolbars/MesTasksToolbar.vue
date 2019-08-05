<template>
  <v-layout row lg12 xs12 md12 sm12 wrap class="toolbar">
    <v-flex
      class="toolbar-basebuttons"

      v-if="layout == 'mes-accept-task-layout' || layout == 'mes-task-main-layout'">
      <v-btn outlined @click="onclickSetupMaterial($event)">Установить материалы</v-btn>
      <v-btn
      outlined v-if="selectedTask.state == 'IN_PLAN' || selectedTask.state == 'IN_WORK'"
      :color="selectedTask.state == 'IN_PLAN' ? 'success' : 'error'"
      @click="onclickAccept">{{selectedTask.state == 'IN_PLAN' ? 'Взять в работу' : 'Приостановить'}}</v-btn>
    </v-flex>
      <v-flex grow class="mes-tasks-toolbar-qr"
      v-if="layout === 'mes-task-stuff-layout'">
      <v-btn outlined class="mes-arrow-back" @click="backToMainLayout"><v-icon dark>arrow_back</v-icon></v-btn>
        <v-text-field
          class="qr-input"
          label="Укажите QR-партии материала для установки"
          required @keyup.enter="submitQrCode"
        ></v-text-field>
        <v-btn outlined class="mes-scan" @click="onclickScan"><v-icon dark>view_week</v-icon></v-btn>
      </v-flex>
   <v-flex class="setup-material-btn" xs2 v-if="layout === 'mes-task-stuff-layout'">
     <v-btn outlined @click="onclickRemoveAllInstallations">Снять все партии</v-btn>
   </v-flex>
  </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: "mes-tasks-toolbar",
  props: {
    layout: String,
    selectedTask: Object,
    installations: Array
  },
  methods: {
    onclickSetupMaterial(event) {
      this.$emit('layout', 'mes-task-stuff-layout');
    },
    onclickAccept(event) {
        switch(this.selectedTask.state) {
          case "IN_PLAN":
            this.$store.dispatch('mes/registerProduction', this.selectedTask);
            break;
          case "IN_WORK":
            this.$store.dispatch('mes/cancelBeginRegistration', this.selectedTask);
            break;
        }
    },
    onclickRemoveAllInstallations() {
      this.$emit('removeAllInstallations');
    },
    submitQrCode(event) {
      this.$store.dispatch('mes/registerMaterialInstallation', { workCenterCode: this.selectedTask.workCenterCode, batchBarcode: event.target.value, factId: 0 });
    },
    backToMainLayout() {
      this.$emit('layout', 'mes-task-main-layout');
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
    height: 60px;
    align-items: center;
  }
  .toolbar.row {
    margin: 0;
  }
  .qr-input{
    width: 500px;
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
