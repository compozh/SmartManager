<template>
<v-layout class="quality-layout">
  <v-flex class="quality-flex">
    <formio-component
      v-if="selectedQuality"
      ref="formioBuilder"
      @formSubmit=formSubmit
      :formDefinition=qualityFormio
      :formCode=properties.qualityProcessType
    />
    </v-flex>
  </v-layout>
</template>

<script>

export default {
  name: 'mes-quality-main-layout',
  computed: {
    selectedQuality() {
      return this.$store.getters['mes/selectedQuality']
    },
    properties() {
      return this.$store.getters['mes/properties']
    },
    workCenter() {
      return this.$store.getters['mes/workCenter']
    },
    qualityFormio() {
      return this.$store.getters['mes/qualityFormio']
    }
  },
  methods: {
    formSubmit(submission) {
      this.$store.dispatch('mes/qualityFormIoSubmit', { formCode: this.properties.qualityProcessType, workCenter: this.workCenter, submission, quality: this.selectedQuality })
    },
    getFormioData() {
      return this.$refs.formioBuilder[0].getFormSubmission()
    }
  }
}
</script>
<style type="text/css" scoped>
.quality-layout {
  width: 100%;
  height: 100%;
}
.quality-flex {
    position: absolute;
    height: 100%;
    overflow-y: auto;
    width: 100%;
  }
  .quality-flex::-webkit-scrollbar {
    background-color:#fff;
    width:16px
  }
  .quality-flex::-webkit-scrollbar-track {
      background-color:#fff
  }
  .quality-flex::-webkit-scrollbar-track:hover {
      background-color:#f4f4f4
  }

  /* scrollbar itself */
 .quality-flex::-webkit-scrollbar-thumb {
      background-color:#babac0;
      border-radius:16px;
      border:5px solid #fff
  }
  .quality-flex::-webkit-scrollbar-thumb:hover {
      background-color:#a0a0a5;
      border:4px solid #f4f4f4
  }

  /* set button(top and bottom of the scrollbar) */
  .quality-flex::-webkit-scrollbar-button {display:none}
</style>
