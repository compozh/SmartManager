<template>
          <AgGridView :education="dataEducation" v-if="dataEducation"></AgGridView>
</template>

<script>
const AgGridView = () => import('../components/OpenAgGridTableComponent.vue')
export default {
  components: {
    AgGridView
  },
  computed: {
    dataEducation() {
      return this.$store.getters['education/getEducationAdditionalTraining']
    },
  },
  created() {
    if (this.$store.getters['education/getEducationAdditionalTraining']) {
      return
    }
    this.$store.dispatch('education/loadEducationAdditionalTraining')
  }
}
</script>