
<template>
  <AgGridView :education="dataWorkWearOnPlace" v-show="dataWorkWearOnPlace"></AgGridView>
</template>

<script>
const AgGridView = () => import('../components/AgGridTableComponent.vue')
export default {
  components: {
    AgGridView
  },
  computed: {
    dataWorkWearOnPlace() {
      return this.$store.getters['education/getWorkWearOnPlace']
    }
  },
  created() {
    let object = {
      load: 'loadWorkWearOnPlace',
      clear: 'setWorkWearOnPlace'
    }
    
    this.$emit('changeRouteTitle', this.$t('Education.getworkwearonplace'))

    this.$store.dispatch('education/setCurrentPageNabu', object)
    this.$store.dispatch('education/loadWorkWearOnPlace')
  }
}
</script>