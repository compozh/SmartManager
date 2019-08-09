<template>
<v-layout row lg12 xs12 md12 sm12 wrap class="toolbar">
  <v-flex grow class="mes-stuff-toolbar-qr">
    <v-text-field
          class="qr-input"
          label="Укажите QR-партии материала для установки"
          required @keyup.enter="submitQrCode">
    </v-text-field>
    <v-btn outlined class="mes-scan" @click="onclickScan" outline color="#326DA8"><v-icon dark>view_week</v-icon></v-btn>
  </v-flex>
  <v-flex class="setup-material-btn" xs2>
    <v-btn outlined v-if="installationsAny" @click="onclickRemoveAllInstallations" outline color="#326DA8">Снять все партии</v-btn>
  </v-flex>
</v-layout>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: "mes-stuff-toolbar",
  props: {
    installations: Object
  },
  computed: {
    installationsAny() {
      var me = this,
        any = false;
      Object.keys(me.installations).forEach(workCenter => {
        var installations = me.installations[workCenter];
        if(!any) {
          any = installations.length;
        }
      });
      return any;
    }
  },
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
    width: 400px;
    height: 55px;
    max-width: 400px;
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
  .mes-stuff-toolbar-qr {
    display: flex;
    align-items: center;
  }
  .mes-scan {
    min-width: auto;
  }
</style>
