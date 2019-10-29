<template>
    <div class="toolbar-builder-container">
        <div class="constructor-title">{{constructorCaption}}</div>
        <v-tabs v-model="selectedTab" class="constructor-tabs">
          <v-tab v-for="tab in tabs" :key=tab.id >
            <v-badge color="#326DA8" overlap>
              {{tab.name}}
            </v-badge>
          </v-tab>
        </v-tabs>
        <div v-if="selectedTab == 0">
            <v-layout row wrap
                class="toolbar"
            >
                <v-text-field
                    class="toolbar-item form-name-text-field"
                    v-model=formNameProperty
                    :label=formNameLabel
                    required
                />
                <v-text-field
                    class="toolbar-item form-code-text-field"
                    :disabled="Boolean(Object.keys(formDefinition).length)"
                    ref="formCode"
                    v-model=formCodeProperty
                    :full-width=false
                    :maxlength="16"
                    :label=formCodeLabel
                    :rules="[() => !!formCodeProperty || this.$t('bpmn.errors.RequiredInputField')]"
                    required
                />
                <v-select
                    v-model=formDisplayProperty
                    class="toolbar-item form-display-type-field"
                    ref="displayType"
                    :items="displays"
                    item-text="text"
                    item-value="value"
                    :label=displayTypeLabel
                    @change=displayChange
                />
                <div class="button-container">
                    <v-btn
                        outline
                        color="success"
                        @click="onAction"
                        class="action-button"
                        :loading=buttonLoading
                    >
                        {{actionText}}
                    </v-btn>
                    <v-btn
                        outline
                        color="error"
                        class="cancel-button"
                        @click="onCancel"
                        :disabled=buttonLoading
                    >
                    {{ $t('bpmn.buttons.Cancel') }}
                    </v-btn>
                </div>
            </v-layout>
            <formbuilder
                class="formio-builder-component-class"
                :form=formioComponents
                :options=options
                ref="formio"
            />
        </div>
        <div v-if="selectedTab==1" class="form-preview-component">
            <formio-component
                class="formio-component-preview"
                :formDefinition=getFormParams()
                :formCode=formCodeProperty
                :actionsDisabled="!Object.keys(formDefinition).length"
            />
        </div>
    </div>
</template>

<script>
import { FormBuilder } from './lib/components/FormBuilder'
import VueApexCharts from 'vue-apexcharts'
/* eslint-disable */
export default {
  name: 'formio-builder-component',
  components: { formbuilder: FormBuilder, apexchart: VueApexCharts },
  data() {
        var me = this
        return {
            formDisplayProperty: me.formDefinition.display || 'form',
            formCodeProperty: me.formDefinition.formCode,
            formNameProperty: me.formDefinition.name,
            formNameLabel: me.$t('bpmn.labels.Name'),
            formCodeLabel: me.$t('bpmn.labels.Code'),
            displayTypeLabel: me.$t('bpmn.labels.DisplayType'),
            options: { 
                noAlerts: true,
                builder: {
                    basic: configBuilder.basic ? {} : false,
                    advanced: configBuilder.advanced ? {} : false,
                    data: configBuilder.data ? {} : false,
                    layout: configBuilder.layout ? {} : false,
                    premium: configBuilder.premium ? {} : false,
                    customBasic: configBuilder.charts ? {
                        title: 'Charts',
                        default: false,
                        weight: 1000,
                        components: {
                            piechart: true,
                            donutchart: true,
                            linechart: true,
                            areachart: true,
                            barchart: true,
                            radialbarchart: true
                        }
                    } : false
                }
            },
            tabs: [
                { index: 0, id: 'designer', name: me.$t('bpmn.labels.Designer')},
                { index: 1, id: 'preview', name: me.$t('bpmn.labels.Preview')}
            ],
            selectedTab: 0,
            constructorCaption: this.$t('bpmn.labels.FormContructor'),
            displays: [ { text: 'Form', value: 'form' }, { text: 'Wizard', value: 'wizard' }, { text: 'PDF', value: 'pdf' } ]
        }
  },
  props: {
    formDefinition: Object,
    buttonLoading: Boolean
  },
  computed: {
    formioComponents() {
      return {
        display: this.formDefinition.display || 'form',
        components: this.formDefinition.components ? JSON.parse(this.formDefinition.components) : [],
        settings: this.formDefinition.settings ? JSON.parse(this.formDefinition.settings) : {}
      }
    },
    formioSubmission() {
      return { data: this.formDefinition.submission ? JSON.parse(this.formDefinition.submission) : [] }
    },
    actionText() {
        return Object.keys(this.formDefinition).length ? this.$t('bpmn.buttons.Save') : this.$t('bpmn.buttons.Create');
    }
  },
  methods: {
    onChange(params) {
        this.$emit('change', this.getFormParams());
    },
    onAction() {
      var formCodeInput = this.$refs.formCode
      if (!formCodeInput.value) {
        formCodeInput.validate(true)
        return
      }
        this.$emit('action', this.getFormParams());
    },
    onCancel() {
        this.$emit('cancel', this.getFormParams());
    },
    getFormParams() {
        var me = this,
            form = this.$refs.formio

        return {
            formCode: this.formCodeProperty,
            name: this.formNameProperty,
            display: form.form.display,
            components: JSON.stringify(form.form.components, null, 4),
            settings: JSON.stringify(form.form.settings, null, 4)
        }
    },
    displayChange(display) {
        var form = this.$refs.formio;
        form.builder.setDisplay(display);
    }
  }
}
</script>

<style lang="scss">
.formio-builder-component-class /deep/ {
  @import'./assets/theme.scss';
  @import "~formiojs/dist/formio.full.min.css";
  @import "~bootstrap/scss/bootstrap";
  @import'./assets/overide.scss';
  @import "~choices.js/public/assets/styles/choices.css";
  @import "~flatpickr/dist/flatpickr.min.css";
}
</style>
