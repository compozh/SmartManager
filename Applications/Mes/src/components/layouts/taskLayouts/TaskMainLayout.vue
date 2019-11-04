<template>
<v-layout class="task-main-layout-block">
  <mes-task-main-layout-toolbar
    @changeDowntimesOverlayVisible=changeDowntimesOverlayVisible
  />

     <v-layout class="mes-task-main-layout">
        <v-flex class="mes-task-main-flex">
          <formio-component
            ref="formioBuilder"
            @formSubmit=formSubmit
            :formDefinition=productionFormio
            :formCode=workCenter.productionRegistrationFormCode
          />
        </v-flex>
    </v-layout>
  </v-layout>
</template>

<script>
export default {
  name: 'mes-task-main-layout',
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
      return this.$store.getters['mes/productionFormio']
    }
  },
  methods: {
    changeDowntimesOverlayVisible() {
      this.$emit('changeDowntimesOverlayVisible')
    },
    formSubmit(submission) {
      this.$store.dispatch('mes/productionFormIoSubmit', { workCenter: this.workCenter, submission, task: this.selectedTask })
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
