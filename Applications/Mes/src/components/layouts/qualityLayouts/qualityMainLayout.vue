<template>
<v-layout class="quality-layout">
  <v-flex class="quality-flex" v-if="initializeQualities" :key="this.qualityFormioKey">
    <formio-form-component
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
  props: {
    initializeQualities: Boolean
  },
  data() {
    return {
      qualityFormioKey: 0
    }
  },
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
      this.qualityFormioKey += 1
      return this.$store.getters['mes/qualityFormio']
    }
  },
  methods: {
    async formSubmit({ submission, completeSubmissionCallback }) {
      var me = this,
        direction = 1,
        properties = {
          workCenterCode: me.workCenter.code,
          id: me.selectedQuality.id
        },
        searchDateTime = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toJSON()

      me.$store.commit('mes/setDialogLinearLoaderMessage', this.$t('mes.dialogs.RegistrationDowntime'))
      await this.$store.dispatch('formio/submitForm', { formCode: me.properties.qualityForm, submission, properties }).then(params => {
        if(params.success) {
          me.$store.commit('mes/setQualities', [])
          me.$store.commit('mes/setInitializeQualities', false)
          me.$store.dispatch('mes/downloadQualities', { processTypeCode: me.properties.qualityProcessType, searchDateTime, direction })
        }
        completeSubmissionCallback(result)
      })
      me.$store.commit('mes/closeDialogLinearLoader')
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
