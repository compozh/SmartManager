<template>
  <AgGridView :education="dataEducation" v-if="dataEducation"></AgGridView>
</template>

<script>
const AgGridView = () => import('../components/AgGridTableComponent.vue')
export default {
  components: {
    AgGridView
  },
  computed: {
    dataEducation() {
      return this.$store.getters['education/getEducationPlan']
    },
  },
  created() {
    this.$store.dispatch('education/loadEducationPlan')
  }
}
</script>