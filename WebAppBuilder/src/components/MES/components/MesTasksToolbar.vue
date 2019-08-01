<template>
  <v-layout row lg12 xs12 md12 sm12 wrap class="toolbar">
    <v-flex
      class="toolbar-basebuttons"
      grow
      v-if="layout == 'mes-accept-task-layout' || layout == 'mes-task-defect-layout' || layout == 'mes-task-main-layout'">
      <v-btn outlined @click="onclickSetupMaterial($event)">Установить материалы</v-btn>
      <v-btn
      outlined v-if="selectedTask.state == 'IN_PLAN' || selectedTask.state == 'IN_WORK'"
      :color="selectedTask.state == 'IN_PLAN' ? 'success' : 'error'" @click="onclickAccept">Взять в работу</v-btn>
      <v-btn
      outlined v-if="selectedTask.state == 'IN_WORK'"
      @click="onclickDefect">Брак</v-btn>
    </v-flex>
      <v-flex
      grow
      v-if="layout === 'mes-task-setup-materials-layout'">
        <v-text-field
          class="qr-input"
          label="Укажите QR-партии материала для установки"
          required
        ></v-text-field>
      </v-flex>
      <v-flex class="downtime-btn"
        v-if="layout == 'mes-accept-task-layout' || layout == 'mes-task-defect-layout' || layout == 'mes-task-main-layout'">
        <v-btn
        outlined color="error" @click="onclickDowntime($event)">Простой</v-btn>
    </v-flex>
   <v-flex class="setup-material-btn" xs2 v-if="layout === 'mes-task-setup-materials-layout'">
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
    selectedTask: Object
  },
  methods:{
    onclickSetupMaterial: function(event) {
      this.$emit('layout', 'mes-task-setup-materials-layout');
    },
    onclickAccept: function(event) {
        let target = event.target;
        if(!target.state || target.state === "accept") {
          this.applyWorkColor = 'error';
          target.textContent = "Остановить";
          target.state = "suspend";
        } else {
          this.applyWorkColor = 'success';
          target.state = "accept";
           target.textContent = "Взять в работу";
        }
    },
    onclickDowntime: function(event) {

    },
    onclickDefect: function(event) {
      this.$emit('layout', 'mes-task-defect-layout');
    },
    onclickRemoveAllInstallations() {
      this.$emit('removeAllInstallations');
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
  }
  .qr-input{
    width: 500px;
  }
  .downtime-btn {
    width: 120px;
    max-width: 120px;
  }
  .setup-material-btn {
    width: 200px;
    max-width: 200px;
  }
</style>
