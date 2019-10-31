<template>
  <AgGridView :education="dataResultsInterimEvaluation" v-show="dataResultsInterimEvaluation"></AgGridView>
</template>

<script>
const AgGridView = () => import('../components/AgGridTableComponent.vue')
export default {
  components: {
    AgGridView
  },
  created() {
    let object = {
      load: 'loadResultsInterimEvaluation',
      clear: 'setResultsInterimEvaluation'
    }
    this.$store.dispatch('education/setCurrentPageNabu', object)
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