<template>
<v-layout class="downtime-layout">
  <v-flex class="downtime-flex" v-if="initializeDowntimes" :key="this.downtimeFormioKey">
    <formio-component
      v-if="selectedDowntime"
      ref="formioBuilder"
      @formSubmit=formSubmit
      :formDefinition=downtimeFormio
      :formCode=workCenter.downtimeRegistrationFormCode
    />
    </v-flex>
  </v-layout>
</template>

<script>

export default {
  name: 'mes-downtime-main-layout',
  props: {
    initializeDowntimes: Boolean,
  },
  data() {
    return {
      downtimeFormioKey: 0
    }
  },
  computed: {
    selectedDowntime() {
      return this.$store.getters['mes/selectedDowntime']
    },
    workCenter() {
      return this.$store.getters['mes/workCenter']
    },
    downtimeFormio() {
      this.downtimeFormioKey += 1
      return this.$store.getters['mes/downtimeFormio']
    }
  },
  methods: {
    formSubmit(submission) {
      this.$store.dispatch('mes/downtimeFormIoSubmit', { workCenter: this.workCenter, submission, downtime: this.selectedDowntime, message:this.$t('mes.dialogs.RegistrationDowntime')})
    },
    getFormioData() {
      return this.$refs.formioBuilder[0].getFormSubmission()
    }
  }
}
</script>
<style type="text/css" scoped>
.downtime-layout {
  width: 100%;
  height: 100%;
}
.downtime-flex {
    position: absolute;
    height: 100%;
    overflow-y: auto;
    width: 100%;
  }
  .downtime-flex::-webkit-scrollbar {
    background-color:#fff;
    width:16px
  }
  .downtime-flex::-webkit-scrollbar-track {
      background-color:#fff
  }
  .downtime-flex::-webkit-scrollbar-track:hover {
      background-color:#f4f4f4
  }

  /* scrollbar itself */
 .downtime-flex::-webkit-scrollbar-thumb {
      background-color:#babac0;
      border-radius:16px;
      border:5px solid #fff
  }
  .downtime-flex::-webkit-scrollbar-thumb:hover {
      background-color:#a0a0a5;
      border:4px solid #f4f4f4
  }

  /* set button(top and bottom of the scrollbar) */
  .downtime-flex::-webkit-scrollbar-button {display:none}
</style>
