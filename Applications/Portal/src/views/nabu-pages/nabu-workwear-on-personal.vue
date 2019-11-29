<template>
    <AgGridView :education="dataWorkwearOnPersonal" v-show="dataWorkwearOnPersonal"></AgGridView>
</template>

<script>
const AgGridView = () => import('../components/AgGridTableComponent.vue')

export default {
  components: {
    AgGridView
  },
  created() {
    let object = {
      load: 'loadWorkwearOnPersonal',
      clear: 'setWorkwearOnPersonal'
    }
    this.$emit('changeRouteTitle', this.$t('Education.getworkwear'))
    this.$store.dispatch('education/setCurrentPageNabu', object)
    this.$store.dispatch('education/loadWorkwearOnPersonal')
  },
  computed: {
    dataWorkwearOnPersonal() {
      return this.$store.getters['education/getWorkwearOnPersonal']
    }
  }
}
</script>

<style>

</style>