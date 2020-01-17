<template>
<v-layout class="task-main-layout-block">
  <mes-task-main-layout-toolbar 
    @changeDowntimesOverlayVisible=changeDowntimesOverlayVisible
    @changeTaskTableView=changeTaskTableView
  />

     <v-layout class="mes-task-main-layout">
        <v-flex class="mes-task-main-flex" :key="this.productionFormioKey">
          <formio-form-component
            ref="formioBuilder"
            @formSubmit=formSubmit
            :formDefinition=productionFormio
            :formCode=workCenter.productionRegistrationFormCode
            :instance=selectedTask
          />
        </v-flex>
    </v-layout>
  </v-layout>
</template>

<script>
export default {
  name: 'mes-task-main-layout',
  data() {
    return {
      productionFormioKey: 0
    }
  },
  computed: {
    dragResizeMode() {
      return this.$store.getters['mes/dragResizeMode']
    },
    selectedTask() {
      return this.$store.getters['mes/selectedTask']
    },
    workCenter() {
      return this.$store.getters['mes/workCenter']
    },
    productionFormio() {
      this.productionFormioKey += 1
      return this.$store.getters['mes/productionFormio']
    }
  },
  methods: {
    changeDowntimesOverlayVisible() {
      this.$emit('changeDowntimesOverlayVisible')
    },
    changeTaskTableView() {
      this.$emit('changeTaskTableView', true)
    },
    formSubmit({ submission, completeSubmissionCallback }) {
      this.$store.dispatch('mes/productionFormIoSubmit',
        { workCenter: this.workCenter, submission, task: this.selectedTask, message: this.$t('mes.dialogs.RegistrationProduction'), deviceSizeType: this.$vuetify.breakpoint.name }
      ).then(completeSubmissionCallback)
    },
    getFormioData() {
      return this.$refs.formioBuilder.getFormSubmission()
    }
  }
}
</script>
<style type="text/css" scoped>
  .mes-task-main-layout  .mes-task-main-flex{
    position: absolute;
    height: calc(100% - 60px);
    overflow-y: auto;
    width: 100%;
  }
  .mes-task-main-layout  .mes-task-main-flex::-webkit-scrollbar {
    background-color:#fff;
    width:16px
  }
  .mes-task-main-layout  .mes-task-main-flex::-webkit-scrollbar-track {
      background-color:#fff
  }
  .mes-task-main-layout  .mes-task-main-flex::-webkit-scrollbar-track:hover {
      background-color:#f4f4f4
  }

  /* scrollbar itself */
 .mes-task-main-layout  .mes-task-main-flex::-webkit-scrollbar-thumb {
      background-color:#babac0;
      border-radius:16px;
      border:5px solid #fff
  }
  .mes-task-main-layout  .mes-task-main-flex::-webkit-scrollbar-thumb:hover {
      background-color:#a0a0a5;
      border:4px solid #f4f4f4
  }

  /* set button(top and bottom of the scrollbar) */
  .mes-task-main-layout  .mes-task-main-flex::-webkit-scrollbar-button {display:none}
  .main-layout {
    padding: 0 10px !important;
  }
  .task-main-layout-block {
    display: block;
    width: 100%;
  }
</style>
