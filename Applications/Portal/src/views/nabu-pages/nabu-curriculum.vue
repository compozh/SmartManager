<template>
  <AgGridView :education="dataEducation" v-show="dataEducation"></AgGridView>
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
    let object = {
      load: 'loadEducationPlan',
      clear: 'setEducationPlan'
    }
    this.$store.dispatch('education/setCurrentPageNabu', object)
    this.$store.dispatch('education/loadEducationPlan')
  }
}
</script>