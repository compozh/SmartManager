<template>
    <AgGridView :education="dataTaskForYear" v-show="dataTaskForYear"></AgGridView>
</template>

<script>
const AgGridView = () => import('../components/AgGridTableComponent.vue')

export default {
  components: {
    AgGridView
  },
  created() {
    let object = {
      load: 'loadTaskForYear',
      clear: 'setTaskForYear'
    }
    this.$store.dispatch('education/setCurrentPageNabu', object)
    this.$store.dispatch('education/loadTaskForYear')
  },
  computed: {
    dataTaskForYear() {
      return this.$store.getters['education/getTaskForYear']
    }
  }
}
</script>

<style>

</style>