<template>
  <AgGridView :education="dataCriterialEvaluation" v-show="dataCriterialEvaluation"></AgGridView>
</template>

<script>
import AgGridView from '../components/AgGridTableComponent.vue'
export default {

  components: {
    AgGridView
  },
  created() {
    let object = {
      load: 'loadCriterialEvaluation',
      clear: 'setCriterialEvaluation'
    }
    this.$store.dispatch('education/setCurrentPageNabu', object)
    this.$store.dispatch('education/loadCriterialEvaluation')
  },
  computed: {
    dataCriterialEvaluation() {

      let test = this.$store.getters['education/getCriterialEvaluation']
      if (test) {
        test.headers[0].width = 50
      }


      return test
    }
  }
}
</script>

<style>

</style>