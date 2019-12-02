<template>
    <AgGridView :education="dataCharacteristicn" v-show="dataCharacteristicn"></AgGridView>
</template>
<script>
import AgGridView from '../components/AgGridTableComponent.vue'
export default {
  components: {
    AgGridView
  },
  created() {
    let object = {
      load: 'loadCharacteristic',
      clear: 'setCharacteristic'
    }
    this.$store.dispatch('education/setCurrentPageNabu', object)
    this.$store.dispatch('education/loadCharacteristic')
  },
  computed: {
    dataCharacteristicn() {
      return this.$store.getters['education/getCharacteristic']
    }
  }
}
</script>
<style scoped>

</style>