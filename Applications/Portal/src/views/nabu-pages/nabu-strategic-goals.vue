<template>
  <AgGridView :education="dataStrategicGoals" v-if="dataStrategicGoals"></AgGridView>
</template>

<script>
const AgGridView = () => import('../components/AgGridTableComponent.vue')

export default {
  components: {
    AgGridView
  },
  created() {
    // if (this.$store.getters['education/getStrategicGoals']) {
    //   return
    // }
    // this.$store.dispatch('education/loadStrategicGoals')
  },
  computed: {
    dataStrategicGoals() {
      // return this.$store.getters['education/getStrategicGoals']
      return undefined
    }
  }
}
</script>

<style>

</style>