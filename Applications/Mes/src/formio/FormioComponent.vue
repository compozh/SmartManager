<template>
  <v-container>
    <formio id="formio" class="formio-container-class"
      :form=formioComponents
      :submission=formioSubmission
      :options=options
      :language=options.language
      @submit=onSubmit
      @change=onChange
      @customEvent=customEvent
      @callCustomEvent=requestToServerAction
      @qrScaner=qrScaner
      @itemAutocomplete=itemAutocomplete
      @connectSignalR=connectSignalR
      ref="formioComponent"
    />
    <formio-qr-scaner
      v-if="qrScanerVisible"
      @changeQrScanerVisible=changeQrScanerVisible
      @submitQrCode=submitQrCode
    />
  </v-container>
</template>

<script>
import { Form } from './lib/components/Form'
import VueApexCharts from 'vue-apexcharts'

/* eslint-disable */
export default {
  name: 'formio-component',
  components: { formio: Form, apexchart: VueApexCharts },
  data() {
    return {
      changedData: {},
      options: {
        noAlerts: true,
        language: 'ru',
        i18n: {
          ru: this.$t('mes.formioForm')
        }
       },
      qrScanerVisible: false,
      qrScanerCallback: () => {}
    }
  },
  created() {
    var me = this
    window.requestToServer = (eventCode, callback) => {
        me.requestToServerAction({ eventCode, callback })
    }
  },
  props: {
    formDefinition: Object,
    formCode: String,
    actionsDisabled: Boolean
  },
  watch: {
    formDefinition: function (newData, oldData) {
      this.changedData = {}
    }
  },
  computed: {
    formioComponents() {
      return {
        display: this.changedData.display || this.formDefinition.display || 'form',
        components: this.changedData.components || (this.formDefinition.components ? JSON.parse(this.formDefinition.components) : []),
        settings: this.changedData.settings || (this.formDefinition.settings ? JSON.parse(this.formDefinition.settings) : {})
      }
    },
    formioSubmission() {
      return this.changedData.submission || { data: this.formDefinition.submission ? JSON.parse(this.formDefinition.submission) : [] }
    },
    ticket() {
      return this.$store.getters['formio/ticket']
    }
  },
  methods: {
    onSubmit(params) {
      this.$emit('formSubmit', JSON.stringify(params.data))
    },
    onChange(params) {

    },
    customEvent(params){
      if(this.actionsDisabled) {
        return;
      }
      var me = this,
        form = me.$refs.formioComponent,
        component = params.component,
        displayLoading = component.displayLoading
      if (displayLoading){
      me.setComponentLoading(component.key, true)
      }
			me.requestToServerAction({ eventCode: params.type, callback: () => {
        if (displayLoading) {
          me.setComponentLoading(component.key, false)
        }
			} });
    },
    setComponentLoading(componentKey, loading) {
      var me = this,
        form = me.$refs.formioComponent

        let componentElement = form.formio.getComponent(componentKey)
        componentElement.loading = loading
        componentElement.disabled = loading
    },
    getFormSubmission() {
      var form = this.$refs.formioComponent
      return JSON.stringify(form.submission, null, 4)
    },
    requestToServerAction({ eventCode, callback }) {
      if(this.actionsDisabled) {
        return;
      }
      var me = this,
        form = this.$refs.formioComponent,
        display = form.form.display,
        components = JSON.stringify(form.form.components, null, 4),
        settings = JSON.stringify(form.form.settings, null, 4),
        submission = JSON.stringify(form.submission.data, null, 4)

      me.$store.dispatch('formio/callFormCustomEvent', { formCode: this.formCode,
        params: { eventCode, components, submission, display, settings }}).then(result => {
          if(result && result.success) {
            var dataChanged = false;
            if (result.components && result.components != components) {
              let tempComponents = JSON.parse(result.components)
              if(tempComponents.length) {
                components = result.components
                dataChanged = true
              }
            }
            if(result.settings && result.settings != settings) {
              let tempSettings = JSON.parse(result.settings)
              if(tempSettings) {
                settings = result.settings
                dataChanged = true
              }
            }
            if(result.display && result.display != display) {
              display = result.display
              dataChanged = true
            }

            if(dataChanged) {
              me.changedData = {
                  display,
                  components: JSON.parse(components),
                  settings: JSON.parse(settings)
              }
            }


            if (result.submission && result.submission !== submission) {
              submission = { data: JSON.parse(result.submission) }
              me.changedData.submission = submission
              form.formio.setSubmission(submission)
            }
          }

            if (callback) {
              callback(result);
            }
      })
    },
    qrScaner({ callback }) {
      this.qrScanerVisible = true;
      this.qrScanerCallback = callback;
    },
    submitQrCode(qrCodeValue) {
      if (qrCodeValue.currentTarget) {
        qrCodeValue = qrCodeValue.currentTarget.value
      }
      if(this.qrScanerCallback) {
        this.qrScanerCallback(qrCodeValue)
      }
    },
    changeQrScanerVisible(state) {
      this.qrScanerVisible = state
    },
    connectSignalR({ application, callback }) {
      if(!application || !callback) {
        this.$store.commit('formio/setSnackbarErrorMessage', this.$t('mes.errors.InitializeSignalR'))
        return
      }
      this.$signalR.connect(application, window.myConfig.SignalRUrl, callback, this.ticket)
    },
    itemAutocomplete({ component, searchValue, callback }) {
      if(this.actionsDisabled) {
        return;
      }
      var form = this.$refs.formioComponent,
        submission = JSON.stringify(form.submission.data, null, 4),
        fieldComponent = component.component,
        params = {
          fieldId: fieldComponent.key,
          tableName: fieldComponent.dataTable,
          fieldName: fieldComponent.dataTableFieldName,
          fieldCode: fieldComponent.dataTableFieldCode,
          additionalCondition: fieldComponent.additionalCondition,
			    countRowToSelect: fieldComponent.countRowToSelect,
          searchValue,
          submission
        }

      this.$store.dispatch('formio/callItemAutocomplete',
        { formCode: this.formCode, params, fetchPolicy: fieldComponent.cachingData ? '' : 'network-only'}).then(result => {
        if(result && callback) {
          callback(result);
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
    .formio-container-class /deep/ {
        @import './assets/theme.scss';
        @import "~formiojs/dist/formio.full.min.css";
        @import "~bootstrap/scss/bootstrap";
        @import './assets/overide.scss';
        @import "~choices.js/public/assets/styles/choices.css";
        @import "~flatpickr/dist/flatpickr.min.css";
    }

    .formio-component {
        position: relative;
    }
</style>
