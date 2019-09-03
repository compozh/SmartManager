<template>
    <v-flex class="mes-productions-content">
        <v-card class="productions-card" v-for="production in sortedProductions" :key="production.factId">

            <mes-production-card
                :production=production
                @deleteProduction=deleteProduction
            />

        </v-card>
    </v-flex>
</template>

<script>
/* eslint-disable */
export default {
  name: 'mes-productions-component',
  computed: {
    productions() {
      return this.$store.getters['mes/productions']
    },
    sortedProductions() {
      return this.productions.sort((a,b) => {
        return a.factId < b.factId ? 1 : (a.factId == b.factId ? 0 : -1)
      })
    }
  },
  methods: {
    async deleteProduction({ production, callback }) {
      await this.$store.dispatch('mes/deleteProduction', production)
      if (callback) {
          callback()
        }
    }
  }
}
</script>

<style type="text/css" scoped>
    .mes-productions-content {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-content: start;
    }
    .productions-card {
        display: flex;
        align-items: start;
        margin: 10px;
        max-width: 400px;
        width: 360px;
        border-radius: 5px;
    }
</style>
