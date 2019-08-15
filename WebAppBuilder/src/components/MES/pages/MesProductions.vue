<template>
    <v-layout class="mes-productions">

      <mes-content-loader v-if="!initializeProductions && !Object.keys(productions).legth" />

      <v-flex v-if="initializeProductions" class="mes-productions-content">
        <v-card class="productions-card" v-for="production in productions" :key="production.factId">
          <mes-production-card :production=production @deleteProduction=deleteProduction(production) />
        </v-card>
      </v-flex>

    </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'
import {ContentLoader} from '../../../../node_modules/vue-content-loader'

export default {
  name: "mes-productions",
  components: {
    ContentLoader
  },
  data() {
    return { initializeProductions: false };
  },
  created() {
    this.initialize();
  },
  computed: {
    properties() {
        return this.$store.getters['mes/properties'];
    },
    productions() {
      return this.$store.getters['mes/productions'];
    }
  },
  methods: {
    async initialize() {
      await this.$store.dispatch('mes/initializeProperties');
      await this.$store.dispatch('mes/initializeProductions', { workerCode: this.properties.workerCode, fetchPolicy: "network-only" });
      this.initializeProductions = true;
    },
    deleteProduction(production) {
      this.$store.dispatch('mes/deleteProduction', production);
    }
  }
}
</script>

<style type="text/css" scoped>
  .mes-productions {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    padding: 0 10px;
    position: absolute;
    height: 100%;
    overflow-y: auto;
    width: 100%;
  }
.mes-productions::-webkit-scrollbar {
    background-color:#fff;
    width:16px
  }
  .mes-productions::-webkit-scrollbar-track {
      background-color:#fff
  }
  .mes-productions::-webkit-scrollbar-track:hover {
      background-color:#f4f4f4
  }

  /* scrollbar itself */
 .mes-productions::-webkit-scrollbar-thumb {
      background-color:#babac0;
      border-radius:16px;
      border:5px solid #fff
  }
  .mes-productions::-webkit-scrollbar-thumb:hover {
      background-color:#a0a0a5;
      border:4px solid #f4f4f4
  }

  /* set button(top and bottom of the scrollbar) */
  .mes-productions::-webkit-scrollbar-button {display:none}
  .mes-productions-content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: start;
  }
  .mes-content-loader {
    position: absolute;
    z-index: 1;
    width: 100%;
  }
  .productions-card {
    display: flex;
    align-items: center;
    margin: 10px;
    max-width: 400px;
    width: 360px;
    border-radius: 5px;
  }
  .wait-for-data-block {
    padding: 20px;
  }
</style>
