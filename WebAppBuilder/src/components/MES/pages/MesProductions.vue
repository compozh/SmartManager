<template>
    <v-layout class="mes-productions">
      <mes-production-toolbar class="mes-production-toolbar" />
      <mes-content-loader :initialize=initializeProductions />
      <v-flex class="mes-productions-content">
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
      await this.$store.dispatch('mes/initializeProductions', this.properties.workerCode);
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
}
.mes-productions-content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow-y: auto;
  height: 94vh !important;
}
.productions-card {
  display: flex;
  align-items: center;
  margin: 10px;
  max-width: 400px;
  width: 360px;
}
.wait-for-data-block {
  padding: 20px;
}
</style>
