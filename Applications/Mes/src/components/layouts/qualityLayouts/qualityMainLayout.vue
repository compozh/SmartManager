<template>
<v-layout class="quality-layout"> 
  <v-flex class="toolbar my-0" v-if="$vuetify.breakpoint.smAndDown">
    <v-btn class="col-12 ma-0 close-btn" @click="changeQualityTableView" text outlined>{{ $t('mes.buttons.Close') }}</v-btn>
  </v-flex>
  <v-flex class="quality-flex" :class="$vuetify.breakpoint.smAndDown? 'small' : ''" v-if="initializeQualities" :key="this.qualityFormioKey">
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
    },
    dragResizeMode: {
      get() {
        return this.$store.getters['mes/dragResizeMode']
      },
      set() {
        this.$store.dispatch('mes/changeDragResizeMode')
      }
    },
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
        completeSubmissionCallback(params)
      })
      me.$store.commit('mes/closeDialogLinearLoader')
    },
    getFormioData() {
      return this.$refs.formioBuilder[0].getFormSubmission()
    },
    changeQualityTableView() {
      this.$emit('changeQualityTableView', true)
    },
    changeDragResizeMode (mode) {
      this.dragResizeMode = mode
      var splitter = document.getElementsByClassName('gutter gutter-horizontal')[0]
      if (!this.dragResizeMode) {
        splitter.style.cssText = 'width:0'
      } else {
        splitter.style.cssText = 'width: 5px'
      }
    },
  },
  created() {
    if(this.$vuetify.breakpoint.smAndDown){
      this.changeDragResizeMode(false)
    }
  }
}
</script>
<style type="text/css" scoped>
.quality-layout {
  width: 100%;
  height: 100%;
}
.toolbar {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  height: 63px;
  border-bottom: 1px solid rgba(2, 2, 2, 0.08);
  width: 99% !important;
}
.close-btn {
  min-width: 90% !important;
  width: 90% !important;
  height: 50px !important;
  border-radius: 5px;
  background-color:#fff;
  border: 1px solid rgba(2, 2, 2, 0.08);
  }
.quality-flex {
  position: absolute;
  height: 100%;
  overflow-y: auto;
  width: 100%;
}
.small {
    top: 60px;
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
