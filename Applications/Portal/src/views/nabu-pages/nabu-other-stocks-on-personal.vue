<template>
  <AgGridView :education="dataOtherStocksOnPersonal" v-show="dataOtherStocksOnPersonal"></AgGridView>
</template>

<script>
const AgGridView = () => import('../components/AgGridTableComponent.vue')
export default {
  components: {
    AgGridView
  },
  computed: {
    dataOtherStocksOnPersonal() {
      return this.$store.getters['education/getOtherStocksOnPersonal']
    }
  },
  created() {
    let object = {
      load: 'loadOtherStocksOnPersonal',
      clear: 'setOtherStocksOnPersonal'
    }
    this.$store.dispatch('education/setCurrentPageNabu', object)
    this.$store.dispatch('education/loadOtherStocksOnPersonal')
  }
}
</script>
