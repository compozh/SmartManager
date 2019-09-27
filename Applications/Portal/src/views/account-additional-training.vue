<template>
    <div>
      <vs-row>
        <vs-col vs-type="flex" vs-justify="center"  vs-w="12">
          <AgGridView :education="educationAdditionalTraining"></AgGridView>
        </vs-col>
      </vs-row>
    </div>
</template>

<script>
const AgGridView = () => import('./components/OpenAgGridTableComponent.vue')
export default {
  components: {
    AgGridView
  },
  data() {
    return {
      headers: [{
        headerName: this.$t('Education.Number'),
      },{
        headerName: this.$t('Education.Competence'),
      },{
        headerName: this.$t('Education.Subject'),
      },{
        headerName: this.$t('Education.Duty'),
      },{
        headerName: this.$t('Education.Priority'),
      },{
        headerName: this.$t('Education.typeAdvancedTraining'),
      },{
        headerName: this.$t('Education.Provider'),
      },{
        headerName: this.$t('Education.Status'),
      },{
        headerName: this.$t('Education.Note'),
      }]
    }
  },
  computed: {
    
    dataEducation() {
      return this.$store.getters['education/getEducationAdditionalTraining']
    },
    educationAdditionalTraining() {
      var object = {
        data: this.dataEducation,
        headers: this.headers
      }
      return object
    }
  },
  created() {
    this.$store.dispatch('education/loadEducationAdditionalTraining')
  }
}
</script>

<style>

</style>