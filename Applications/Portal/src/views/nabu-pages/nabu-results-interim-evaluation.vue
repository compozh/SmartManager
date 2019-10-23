<template>
  <AgGridView :education="dataResultsInterimEvaluation" v-if="dataResultsInterimEvaluation"></AgGridView>
</template>

<script>
const AgGridView = () => import('../components/AgGridTableComponent.vue')
export default {
  components: {
    AgGridView
  },
  created() {
    if (this.$store.getters['education/getResultsInterimEvaluation']) {
      return
    }
    this.$store.dispatch('education/loadResultsInterimEvaluation')
  },
  computed: {
    dataResultsInterimEvaluation() {
      return this.$store.getters['education/getResultsInterimEvaluation']
    }
  }
}
</script>

<style>

</style>