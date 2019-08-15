<template>
    <div class="installations-block">
      <v-card
        class="installation-card"
        v-for="installation in sortedInstallations" 
        :key="installation.id"
        :ref="installation.batchBarcode"
      >

        <mes-installation-card 
          :installation=installation
          @removeInstallation="removeInstallation(installation)"
        />

      </v-card>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: "mes-installations-component",
  props: {
    workCenterCodes: Array
  },
  computed: {
    installations() {
      return this.$store.getters['mes/installations'];
    },
    sortedInstallations() {
      let installations = [];
      for(let workCenterCode of this.workCenterCodes) {
        let installationsByWorkCenter = this.installations[workCenterCode];
        if(!installationsByWorkCenter) {
          continue;
        }
        for(let installation of installationsByWorkCenter) {
          installation.workCenterCode = workCenterCode;
          installations.push(installation);
        }
      }

      installations.sort((a,b) => {
        return a.id < b.id ? 1 : (a.id == b.id ? 0 : -1);
      });
      return installations;
    }
  },
  methods: {
    removeInstallation(installation) {
      this.$store.dispatch('mes/removeInstallation', { installation, workCenterCode: installation.workCenterCode });
    }
  }
}
</script>

<style type="text/css" scoped>
  .mes-installations .installations-block {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 0 10px;
    position: absolute;
    height: calc(100% - 60px);
    overflow-y: auto;
    width: 100%;
  }
  .mes-installations .installations-block::-webkit-scrollbar {
    background-color:#fff;
    width:16px
  }
  .mes-installations .installations-block::-webkit-scrollbar-track {
      background-color:#fff
  }
  .mes-installations .installations-block::-webkit-scrollbar-track:hover {
      background-color:#f4f4f4
  }

  /* scrollbar itself */
 .mes-installations .installations-block::-webkit-scrollbar-thumb {
      background-color:#babac0;
      border-radius:16px;
      border:5px solid #fff
  }
  .mes-installations .installations-block::-webkit-scrollbar-thumb:hover {
      background-color:#a0a0a5;
      border:4px solid #f4f4f4
  }

  /* set button(top and bottom of the scrollbar) */
  .mes-installations::-webkit-scrollbar-button {display:none}
  .installations-block {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    height: 100%;
    justify-content: center;
  }
  .installation-card {
    display: flex;
    align-items: center;
    width: 360px;
    margin: 10px;
    height: max-content;
    border-radius: 5px;
  }
</style>
