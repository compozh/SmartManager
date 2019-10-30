<template>
<div>
  <AgGridView :education="dataTaskForYear" v-if="dataTaskForYear"></AgGridView>
</div>
</template>

<script>
const AgGridView = () => import('../components/AgGridTableComponent.vue')
export default {
  components: {
    AgGridView
  },
  created() {
    if (this.$store.getters['education/getTaskForYear']) {
      return
    }
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