<template>
    <AgGridView :education="dataNormsOfWorkwear" v-show="dataNormsOfWorkwear"></AgGridView>
</template>
<script>
import AgGridView from '../components/AgGridTableComponent.vue'
export default {
  components: {
    AgGridView
  },
  created() {
    let object = {
      load: 'loadNormsOfWorkwear',
      clear: 'setNormsOfWorkwear'
    }
    this.$store.dispatch('education/setCurrentPageNabu', object)
    this.$store.dispatch('education/loadNormsOfWorkwear')
  },
  computed: {
    dataNormsOfWorkwear() {
      return this.$store.getters['education/getNormsOfWorkwear']
    }
  }
}
</script>
<style scoped>

</style>