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
      return this.$store.getters['education/getEducationResult']
    }
  },
  created() {
    let object = {
      load: 'loadEducationResult',
      clear: 'setEducationResult'
    }
    this.$store.dispatch('education/setCurrentPageNabu', object)
    this.$store.dispatch('education/loadEducationResult')
  }
}
</script>