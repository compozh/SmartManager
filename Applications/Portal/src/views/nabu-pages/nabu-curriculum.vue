<template>
<div v-show="dataEducation">
  <div class="btn-container" >
      <vs-button size="large" type="line" icon-pack="feather" icon="icon-clipboard" @click="getFormPlan">{{$t('Education.btnFormPlane')}}</vs-button>
  </div>
  <AgGridView :education="dataEducation" v-show="dataEducation"></AgGridView>
</div>
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
    fileLink(){
      return this.$store.getters['education/getIndividualPlanReport']
    }

  },
  created() {
    let object = {
      load: 'loadEducationPlan',
      clear: 'setEducationPlan'
    }
    this.$store.dispatch('education/setCurrentPageNabu', object)
    this.$store.dispatch('education/loadEducationPlan')
    this.$store.dispatch('education/loadIndividualPlanReport')
  },
  methods: {
    getFormPlan() {
      window.open(this.fileLink); 
    }
  }
}
</script>
<style scoped>
.btn-container{
  margin-bottom: 10px;
}
</style>