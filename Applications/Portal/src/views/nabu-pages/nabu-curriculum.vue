<template>
    <div>
      <vs-row>
        <vs-col vs-type="flex" vs-justify="center"  vs-w="12">
          <AgGridView :education="educationPlan" v-if="dataEducation"></AgGridView>
        </vs-col>
      </vs-row>
    </div>
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
        headerName: this.$t('Education.Competence'),
        field: 'competence',
      },{
        headerName: this.$t('Education.ProfessionalTrainingType'),
        field: 'professionalTrainingType',
      },{
        headerName: this.$t('Education.Subject'),
        field: 'subject',
      },{
        headerName: this.$t('Education.TrainingTheme'),
        field: 'trainingTheme',
      },{
        headerName: this.$t('Education.DateParticipationInTheTrainingEvent'),
        field: 'startAndEndDate',
      },{
        headerName: this.$t('Education.Description'),
        field: 'description',
      }]
    }
  },
  computed: {
    dataEducation() {
      return this.$store.getters['education/getEducationPlan']
    },
    educationPlan() {
      var object = {
        data: this.dataEducation,
        headers: this.headers
      }
      return object
    }
  },
  created() {
    this.$store.dispatch('education/loadEducationPlan')
  }
}
</script>