<template>
  <AgGridView :education="educationResult"></AgGridView>
</template>

<script>
const AgGridView = () => import('../components/AgGridTableComponent.vue')
export default {
  components: {
    AgGridView
  },
  data() {
    return {
      headers: [{
        headerName: this.$t('Education.educationalInstitution'),
        field: 'educationalInstitution',
      },{
        headerName: this.$t('Education.typeAdvancedTraining'),
        field: 'typeAdvancedTraining',
      },{
        headerName: this.$t('Education.TrainingTheme'),
        field: 'TrainingTheme',
      },{
        headerName: this.$t('Education.EventDateStart'),
        field: 'dateStart',
      },{
        headerName: this.$t('Education.EventDateEnd'),
        field: 'dateEnd',
      },{
        headerName: this.$t('Education.countHours'),
        field: 'countHours',
      },{
        headerName: this.$t('Education.NoteLong'),
        field: 'note',
      }]
    }
  },
  computed: {
    dataEducation() {
      return this.$store.getters['education/getEducationResult']
    },
    educationResult() {
      var object = {
        data: this.dataEducation,
        headers: this.headers
      }
      return object
    }
  },
  created() {
    this.$store.dispatch('education/loadEducationResult')
  }
}
</script>