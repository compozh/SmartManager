<template>
<v-layout row lg12 xs12 md12 sm12 wrap class="toolbar">
  <v-flex grow class="mes-stuff-toolbar-qr">
    <v-text-field 
          class="qr-input"
          label="Укажите QR-партии материала для установки"
          required @keyup.enter="submitQrCode">
    </v-text-field>
    <v-btn outlined @click="onclickScan"><v-icon dark>view_week</v-icon></v-btn>
  </v-flex>
  <v-flex class="setup-material-btn" xs2>
    <v-btn outlined @click="onclickRemoveAllInstallations">Снять все партии</v-btn>
  </v-flex>
</v-layout>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: "mes-stuff-toolbar",
  methods: {
    onclickRemoveAllInstallations() {
      this.$emit('removeAllInstallations');
    },
    submitQrCode(event) {
      this.$emit('submitQrCode', event.target.value);
    },
    onclickScan(event) {
    }
  }
}
</script>


<style type="text/css" scoped>
  .toolbar {
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-between;
    padding-left: 10px;
  }
  .toolbar-basebuttons{
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
  .toolbar.row {
    margin: 0;
  }
  .qr-input{
    width: 500px;
  }
  .downtime-btn {
    width: 150px;
    max-width: 150px;
  }
  .setup-material-btn {
    width: 200px;
    max-width: 200px;
  }
  .mes-stuff-toolbar-qr {
    display: flex;
  }
</style>
