<template>
  <v-container>
    <formio id="formio" class="formio-container-class"
      :form=formioComponents
      :submission=formioSubmission
      :options=options
      language="ru"
      @submit=onSubmit
      @change=onChange
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
      if(!me.actionsDisabled) {
        me.requestToServerAction(eventCode, callback)
      }
    }
    window.qrScaner = callback => {
        me.qrScaner(callback)
    }
    window.connectSignalR = (application, callback) => {
      if(!me.actionsDisabled) {
        me.connectSignalR(application, callback)
      }
    }
    window.itemAutocomplete = (field, searchValue, callback) => {
      if(!me.actionsDisabled) {
        me.itemAutocomplete(field, searchValue, callback)
      }
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
    getFormSubmission() {
      var form = this.$refs.formioComponent
      return JSON.stringify(form.submission, null, 4)
    },
    requestToServerAction(eventCode, callback) {
      var me = this,
        form = this.$refs.formioComponent,
        display = form.form.display,
        components = JSON.stringify(form.form.components, null, 4),
        settings = JSON.stringify(form.form.settings, null, 4),
        submission = JSON.stringify(form.submission, null, 4)

      me.$store.dispatch('formio/callFormCustomEvent', { formCode: this.formCode,
        params: { eventCode, components, submission, display, settings }}).then(result => {
          if(!result)
          {
            return
          }
            if (callback) {
              callback(result);
            }

            var dataChanged = false;
            if (result.components && result.components != components) {
              components = result.components
              dataChanged = true
            }
            if(result.settings && result.settings != settings) {
              settings = result.settings
              dataChanged = true
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
              me.changedData.submission = JSON.parse(result.submission)
            }
      })
    },
    qrScaner(callback) {
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
    connectSignalR(application, callback) {
      if(!application || !callback) {
        this.$store.commit('formio/setSnackbarErrorMessage', this.$t('bpmn.errors.InitializeSignalR'))
        return
      }
      this.$signalR.connect(application, window.myConfig.SignalRUrl, callback, this.ticket)
    },
    itemAutocomplete(field, searchValue, callback) {
      var form = this.$refs.formioComponent,
        submission = JSON.stringify(form.submission, null, 4),
        fieldComponent = field.component,
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
</style>
