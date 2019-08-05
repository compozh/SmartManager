<template>
    <v-layout class="mes-productions">
      <mes-production-toolbar class="mes-production-toolbar" />
      <div v-if="!initializeUsersProductionEvents" class="wait-for-data-block">
            <ContentLoader>
              <rect x="0" y="0" rx="3" ry="3" width="400" height="10" />
              <rect x="20" y="20" rx="3" ry="3" width="220" height="10" />
              <rect x="20" y="40" rx="3" ry="3" width="170" height="10" />
              <rect x="0" y="60" rx="3" ry="3" width="400" height="10" />
              <rect x="20" y="80" rx="3" ry="3" width="200" height="10" />
              <rect x="20" y="100" rx="3" ry="3" width="350" height="10" />
            </ContentLoader>
          </div>
    <div v-for="(productionsByWorkCenter, workCenter) in usersProductionEvents" :key="workCenter">
    <v-card class="card" v-for="production in productionsByWorkCenter" :key="production.factId">
      <mes-production-card :production=production @deleteProduction=deleteProduction(production) />
    </v-card>
    </div>
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
    return { initializeUsersProductionEvents: false };
  },
  created() {
    this.initialize();
  },
  computed: {
    workCenters() {
        return this.$store.getters['mes/workCenters'];
    },
    usersProductionEvents() {
      return this.$store.getters['mes/usersProductionEvents'];
    }
  },
  methods: {
    async initialize() {
      await this.$store.dispatch('mes/initializeWorkCenters', {uuid: "QU9V0+AJ26LAGNLFGXLKIK6NM322NQSQ82EQ8PINQJ4="});
      await this.$store.dispatch('mes/initializeUsersProductionEvents', this.workCenters);
      this.initializeUsersProductionEvents = true;
    },
    deleteProduction(production) {
      this.$store.dispatch('mes/deleteProduction', production.factId);
    }
  }
}
</script>
<style type="text/css" scoped>
  .mes-productions {

  }
</style>
