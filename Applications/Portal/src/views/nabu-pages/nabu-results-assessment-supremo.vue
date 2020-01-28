<template>
  <AgGridView :education="dataResultsAssessmentSupremo" v-show="dataResultsAssessmentSupremo"></AgGridView>
</template>

<script>
const AgGridView = () => import('../components/AgGridTableComponent.vue')
export default {
  components: {
    AgGridView
  },
  created() {
    let object = {
      load: 'loadResultsAssessmentSupremo',
      clear: 'setResultsAssessmentSupremo'
    }
    this.$store.dispatch('education/setCurrentPageNabu', object)
    this.$store.dispatch('education/loadResultsAssessmentSupremo')
  },
  computed: {
    dataResultsAssessmentSupremo() {
      return this.$store.getters['education/getResultsAssessmentSupremo']
    }
  }
}
</script>

<style>

</style>