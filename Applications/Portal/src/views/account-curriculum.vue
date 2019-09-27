<template>
    <div>
      <vs-row>
        <vs-col vs-type="flex" vs-justify="center"  vs-w="12">
          <AgGridView :education="educationPlan"></AgGridView>
        </vs-col>
      </vs-row>
    </div>
</template>

<script>
const AgGridView = () => import('./components/AgGridTableComponent.vue')
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
        headerName: this.$t('Education.KindTraining'),
        field: 'kindTraining',
      },{
        headerName: this.$t('Education.Subject'),
        field: 'subject',
      },{
        headerName: this.$t('Education.TopicTraining'),
        field: 'topicTraining',
      },{
        headerName: this.$t('Education.DateParticipationInTheTrainingEvent'),
        field: 'date',
      },{
        headerName: this.$t('Education.Note'),
        field: 'note',
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