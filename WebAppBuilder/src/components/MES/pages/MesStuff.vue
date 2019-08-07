<template>
  <v-layout class="mes-stuff">
    <mes-stuff-toolbar class="mes-stuff-toolbar" :installations=installations @removeAllInstallations=removeAllInstallations @submitQrCode=submitQrCode />
    <mes-content-loader :initialize=initializeInstallations />
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
    return { initializeInstallations: false };
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
      await this.$store.dispatch('mes/initializeInstallations', this.workCenters);
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
    }
  }
}
</script>
<style type="text/css" scoped>
  .mes-stuff{
    display: block;
  }
  .installations-block {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  /* height: 88vh;
  overflow-y: auto; */
}
.installation-card{
  display: flex;
  align-items: center;
  max-width: 400px;
  margin: 10px;
  width: 360px;
  max-height: 300px;
}
.wait-for-data-block {
  padding: 20px;
}
</style>
