<template>
  <AgGridView :education="dataSelfEsteemResults" v-if="dataSelfEsteemResults"></AgGridView>
</template>

<script>
const AgGridView = () => import('../components/AgGridTableComponent.vue')
export default {
  components: {
    AgGridView
  },
  created() {
    if (this.$store.getters['education/getSelfEsteemResults']) {
      return
    }
    this.$store.dispatch('education/loadSelfEsteemResults')
  },
  computed: {
    dataSelfEsteemResults() {
      return this.$store.getters['education/getSelfEsteemResults']
    }
  }
}
</script>
