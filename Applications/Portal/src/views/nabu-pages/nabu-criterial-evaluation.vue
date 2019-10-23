<template>
  <AgGridView :education="dataCriterialEvaluation" v-if="dataCriterialEvaluation"></AgGridView>
</template>

<script>
const AgGridView = () => import('../components/AgGridTableComponent.vue')
export default {

  components: {
    AgGridView
  },
  created() {
    if (this.$store.getters['education/getCriterialEvaluation']) {
      return
    }
    this.$store.dispatch('education/loadCriterialEvaluation')
  },
  computed: {
    dataCriterialEvaluation() {
      return this.$store.getters['education/getCriterialEvaluation']
    }
  }
}
</script>

<style>

</style>