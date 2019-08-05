<template>
    <v-layout class="mes-stuff">
      <mes-stuff-toolbar class="mes-stuff-toolbar" @removeAllInstallations=removeAllInstallations @submitQrCode=submitQrCode />
      <div v-if="!initializeInstallations" class="wait-for-data-block">
            <ContentLoader>
              <rect x="0" y="0" rx="3" ry="3" width="400" height="10" />
              <rect x="20" y="20" rx="3" ry="3" width="220" height="10" />
              <rect x="20" y="40" rx="3" ry="3" width="170" height="10" />
              <rect x="0" y="60" rx="3" ry="3" width="400" height="10" />
              <rect x="20" y="80" rx="3" ry="3" width="200" height="10" />
              <rect x="20" y="100" rx="3" ry="3" width="350" height="10" />
            </ContentLoader>
          </div>
    <div v-for="(installationsByWorkCenter, workCenter) in installations" :key="workCenter">
    <v-card class="card" v-for="installation in installationsByWorkCenter" :key="installation.id">
      <mes-installation :installation=installation @removeInstallation="removeInstallation(installation, workCenter)"/>
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
      await this.$store.dispatch('mes/initializeWorkCenters', {uuid: "QU9V0+AJ26LAGNLFGXLKIK6NM322NQSQ82EQ8PINQJ4="});
      await this.$store.dispatch('mes/initializeInstallations', this.workCenters);
      this.initializeInstallations = true;
    },
   removeAllInstallations() {
      var me = this;
      Object.keys(me.installations).forEach(workCenterCode => {
        var installationsByWorkCenters = me.installations[workCenterCode];
        installationsByWorkCenters.forEach(installation => {
          me.removeInstallation({ installation, workCenterCode });
        });
      });
    },
    removeInstallation({ installation, workCenterCode }) {
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
</style>
