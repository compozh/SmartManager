<template>
  <AgGridView :education="dataSelfEsteemResults" v-show="dataSelfEsteemResults"></AgGridView>
</template>

<script>
const AgGridView = () => import('../components/AgGridTableComponent.vue')
export default {
  components: {
    AgGridView
  },
  created() {
    let object = {
      load: 'loadSelfEsteemResults',
      clear: 'setSelfEsteemResults'
    }
    this.$store.dispatch('education/setCurrentPageNabu', object)
    this.$store.dispatch('education/loadSelfEsteemResults')
  },
  computed: {
    dataSelfEsteemResults() {
      return this.$store.getters['education/getSelfEsteemResults']
    }
  }
}
</script>
