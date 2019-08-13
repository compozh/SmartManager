<template>
  <v-layout class="mes-stuff">
    <mes-qr-scaner
      v-if="qrScanerVisible" 
      @changeQrScanerVisible=changeQrScanerVisible
      @submitQrCode=submitQrCode
    />

    <mes-stuff-toolbar 
      class="mes-stuff-toolbar"
      :installations=installations
      @removeAllInstallations=removeAllInstallations
      @submitQrCode=submitQrCode />

    <mes-content-loader v-if="!initializeInstallations" />

    <div class="installations-block" v-for="(installationsByWorkCenter, workCenter) in installations" :key="workCenter">
      <v-card class="installation-card" v-for="installation in installationsByWorkCenter" :key="installation.id">
        <mes-installation-card :installation=installation @removeInstallation="removeInstallation(installation, workCenter)"/>
      </v-card>
    </div>

  </v-layout>
</template>
<script>
import {mapGetters} from 'vuex'
import {ContentLoader} from '../../../../node_modules/vue-content-loader'

export default {
  name: "mes-stuff",
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
      var me = this;
      Object.keys(me.installations).forEach(workCenterCode => {
        var installationsByWorkCenters = me.installations[workCenterCode];
        installationsByWorkCenters.forEach(installation => {
          me.removeInstallation(installation, workCenterCode);
        });
      });
    },
    removeInstallation(installation, workCenterCode) {
      this.$store.dispatch('mes/removeInstallation', { installation, workCenterCode });
    },
    submitQrCode(code) {
      let workCenters = this.workCenters;
      if(workCenters && workCenters.length) {
        this.$store.dispatch('mes/registerMaterialInstallation', { workCenterCode: workCenters[0].code, batchBarcode: code, factId: 0 });
      }
    },
    changeQrScanerVisible(visible) {
      this.qrScanerVisible = visible;
    }
  }
}
</script>
<style type="text/css" scoped>
.mes-stuff{
  display:block;
  height: 100%;
}
  .mes-stuff .installations-block{
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    padding: 0 10px;
    position: absolute;
    height: calc(100% - 60px);
    overflow-y: auto;
    width: 100%;
  }
.mes-stuff .installations-block::-webkit-scrollbar {
    background-color:#fff;
    width:16px
  }
  .mes-stuff .installations-block::-webkit-scrollbar-track {
      background-color:#fff
  }
  .mes-stuff .installations-block::-webkit-scrollbar-track:hover {
      background-color:#f4f4f4
  }

  /* scrollbar itself */
 .mes-stuff .installations-block::-webkit-scrollbar-thumb {
      background-color:#babac0;
      border-radius:16px;
      border:5px solid #fff
  }
  .mes-stuff .installations-block::-webkit-scrollbar-thumb:hover {
      background-color:#a0a0a5;
      border:4px solid #f4f4f4
  }

  /* set button(top and bottom of the scrollbar) */
  .mes-stuff::-webkit-scrollbar-button {display:none}
  .installations-block {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  height: 100%;
  }
  .installation-card{
    display: flex;
    align-items: center;
    width: 360px;
    margin: 10px;
    height: max-content;
  }
  .wait-for-data-block {
    padding: 20px;
  }
</style>
