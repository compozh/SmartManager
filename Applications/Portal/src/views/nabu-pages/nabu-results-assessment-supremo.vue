<template>
  <AgGridView :education="dataResultsAssessmentSupremo" v-if="dataResultsAssessmentSupremo"></AgGridView>
</template>

<script>
const AgGridView = () => import('../components/AgGridTableComponent.vue')
export default {
  components: {
    AgGridView
  },
  created() {
    if (this.$store.getters['education/getResultsAssessmentSupremo']) {
      return
    }
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