<template>
    <AgGridView :education="dataTraningSchedule" v-show="dataTraningSchedule"></AgGridView>
</template>

<script>
const AgGridView = () => import('../components/AgGridTableComponent.vue')

export default {
  components: {
    AgGridView
  },
  created() {
    let object = {
      load: 'loadTrainingSchedule',
      clear: 'setTrainingSchedule'
    }
    this.$store.dispatch('education/setCurrentPageNabu', object)
    this.$store.dispatch('education/loadTrainingSchedule')
  },
  computed: {
    dataTraningSchedule() {
      return this.$store.getters['education/getTrainingSchedule']
    }
  }
}
</script>

<style>

</style>