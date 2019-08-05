<template>
    <v-layout class="mes-productions">
      <mes-production-toolbar class="mes-production-toolbar" />
      <div v-if="!initializeProductions" class="wait-for-data-block">
            <ContentLoader>
              <rect x="0" y="0" rx="3" ry="3" width="400" height="10" />
              <rect x="20" y="20" rx="3" ry="3" width="220" height="10" />
              <rect x="20" y="40" rx="3" ry="3" width="170" height="10" />
              <rect x="0" y="60" rx="3" ry="3" width="400" height="10" />
              <rect x="20" y="80" rx="3" ry="3" width="200" height="10" />
              <rect x="20" y="100" rx="3" ry="3" width="350" height="10" />
            </ContentLoader>
          </div>
    <v-card class="productions-card" v-for="production in productions" :key="production.factId">
      <mes-production-card :production=production @deleteProduction=deleteProduction(production) />
    </v-card>
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
.productions-card {
  margin: 10px;
  max-width: 400px;
}
.wait-for-data-block {
  padding: 20px;
}
</style>
