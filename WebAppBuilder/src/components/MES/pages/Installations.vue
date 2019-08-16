<template>
  <v-layout class="mes-installations">
    <mes-qr-scaner
      v-if="qrScanerVisible"
      @changeQrScanerVisible=changeQrScanerVisible
      @submitQrCode=submitQrCode
    />

    <mes-installations-toolbar
      class="mes-installations-toolbar"
      :installations=installations
      @removeAllInstallations=removeAllInstallations
      @submitQrCode=submitQrCode
      @changeQrScanerVisible=changeQrScanerVisible />

    <mes-content-loader v-if="!initializeInstallations && !Object.keys(installations).length" />

    <mes-installations-component
      :workCenterCodes="Object.keys(workCenters)"
      ref="installationCards"
    />

  </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'
import {ContentLoader} from 'vue-content-loader'

export default {
  name: "mes-installations",
  components: {
    ContentLoader
  },
  data() {
    return {
      qrScanerVisible: false,
      initializeInstallations: false
    };
  },
  created() {
    this.initialize();
  },
  computed: {
    workCenters() {
        return this.$store.getters['mes/workCenters'];
    },
    installations() {
      return this.$store.getters['mes/installations'];
    }
  },
  methods: {
    async initialize() {
      await this.$store.dispatch('mes/initializeWorkCenters');
      await this.$store.dispatch('mes/initializeInstallations', { workCenterCodes: Object.keys(this.workCenters) });
      this.initializeInstallations = true;
    },
    removeAllInstallations() {
      let me = this,
        workCenterCodes = Object.keys(me.installations);
      for(let workCenterCode of workCenterCodes) {
        let installationsByWorkCenter = me.installations[workCenterCode];
        for(let installation of installationsByWorkCenter) {
          me.removeInstallation(installation, workCenterCode);
        }
      }
    },
    removeInstallation(installation, workCenterCode) {
      this.$store.dispatch('mes/removeInstallation', { installation, workCenterCode });
    },
    async submitQrCode({ qrCodeValue, callback}) {
      let installationCards = this.$refs.installationCards,
          installationCard = installationCards.$refs[qrCodeValue],
          installationsBlock = installationCards.$refs.installationsBlock;

      if(installationCard[0]) {
        installationsBlock.$el.scrollTo(0, installationCard[0].$el.offsetTop) // ToDo Проверить методв $vuetify.goto(target, option) после обновления Vuetify до 2.0
        installationCard[0].$el.classList.add('activeInstallation')
        setTimeout(() => { installationCard[0].$el.classList.remove('activeInstallation') }, 500);
        if(callback) {
          callback();
        }
        return;
      }
      let workCenters = this.workCenters,
        workCenterCodes = Object.keys(workCenters);
      if(workCenterCodes.length) {
        await this.$store.dispatch('mes/registerMaterialInstallation', { workCenterCode: workCenters[workCenterCodes[0]].code, batchBarcode: qrCodeValue, factId: 0 });
      }
      if(callback) {
        callback();
      }
    },
    changeQrScanerVisible(visible) {
      this.qrScanerVisible = visible;
    }
  }
}
</script>

<style type="text/css" scoped>
  .mes-installations {
    display:block;
    height: 100%;
  }
  .wait-for-data-block {
    padding: 20px;
  }
  .mes-content-loader {
    z-index: 1;
  }
</style>
