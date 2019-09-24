<template>
<v-layout row lg12 xs12 md12 sm12 wrap class="toolbar">

  <mes-qr-scaner
    v-if="qrScanerVisible"
    @changeQrScanerVisible=changeQrScanerVisible
    @submitQrCode=submitQrCode
  />

  <v-flex grow class="mes-installations-toolbar-qr">

    <v-text-field
          class="qr-input"
          label="Укажите QR-партии материала для установки"
          v-model="inputQrCode"
          :disabled="this.disableQrInput"
          required @keyup.enter="submitQrCode"
    >

    </v-text-field>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
         <v-btn outlined class="mes-scan" @click="changeQrScanerVisible(true)" color="#326DA8" @mousedown.stop v-on="on">
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="#326DA8" d="M4,4H10V10H4V4M20,4V10H14V4H20M14,15H16V13H14V11H16V13H18V11H20V13H18V15H20V18H18V20H16V18H13V20H11V16H14V15M16,15V18H18V15H16M4,20V14H10V20H4M6,6V8H8V6H6M16,6V8H18V6H16M6,16V18H8V16H6M4,11H6V13H4V11M9,11H13V15H11V13H9V11M11,6H13V10H11V6M2,2V6H0V2A2,2 0 0,1 2,0H6V2H2M22,0A2,2 0 0,1 24,2V6H22V2H18V0H22M2,18V22H6V24H2A2,2 0 0,1 0,22V18H2M22,22V18H24V22A2,2 0 0,1 22,24H18V22H22Z" />
          </svg>
        </v-btn>
      </template>
      <span>Сканировать QR код</span>
    </v-tooltip>
  </v-flex>
  <v-flex class="setup-material-layout" xs2 v-if="installations.length">

    <v-btn outlined
      class="remove-installations-button"
      @click="onclickRemoveAllInstallations"
      color="#326DA8"
    >
      Снять все партии
    </v-btn>

  </v-flex>
</v-layout>
</template>

<script>

export default {
  data() {
    return { qrScanerVisible: false, inputQrCode: '', disableQrInput: false }
  },
  name: 'mes-installations-toolbar',
  computed: {
    installations() {
      return this.$store.getters['mes/installations']
    }
  },
  methods: {
    onclickRemoveAllInstallations() {
      this.$emit('removeAllInstallations')
    },
    submitQrCode(qrCodeValue) {
      var me = this
      if (qrCodeValue.currentTarget) {
        qrCodeValue = qrCodeValue.currentTarget.value
      }
      if (qrCodeValue == '') {
        return
      }
      me.disableQrInput = true
      me.$emit('submitQrCode', { qrCodeValue, callback: () => {
        me.disableQrInput = false
        me.inputQrCode = ''
      }})
    },
    changeQrScanerVisible(state) {
      this.qrScanerVisible = state
    }
  }
}
</script>

<style type="text/css" scoped>
  .toolbar {
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: space-between;
    padding-left: 10px;
  }
  .toolbar-basebuttons{
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    border-bottom: 1px solid rgba(2, 2, 2, 0.08);
  }
  .toolbar.row {
    margin: 0;
  }
  .qr-input{
    height: 55px;
    max-width: 400px;
  }
  .downtime-btn {
    width: 150px;
    max-width: 150px;
  }
  .v-btn.v-btn--outlined {
    height: 50px;
  }
  .setup-material-layout {
    display: flex;
    align-items: center;
    width: 200px;
    max-width: 200px;
    border-bottom: 1px solid rgba(2, 2, 2, 0.08);
  }
  .remove-installations-button {
    border-radius:5px;
  }
  .mes-installations-toolbar-qr {
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(2, 2, 2, 0.08);
  }
  .mes-scan {
    min-width: auto;
    border-radius:5px;
  }
</style>
