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
                    :rules="[() => !!formCodeProperty || this.$t('mes.errors.RequiredInputField')]"
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
                    {{ $t('mes.buttons.Cancel') }}
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
            <formio-form-component
                class="formio-form-component-preview"
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
            formNameLabel: me.$t('mes.labels.Name'),
            formCodeLabel: me.$t('mes.labels.Code'),
            displayTypeLabel: me.$t('mes.labels.DisplayType'),
            options: {
                noAlerts: true,
                language: 'ru',
                i18n: {
                  ru: this.$t('mes.formioForm')
                },
                builder: {
                    basic: {},
                    advanced: {},
                    data: {},
                    layout: {},
                    premium: {},
                    customBasic: {
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
                    }
                }
            },
            tabs: [
                { index: 0, id: 'designer', name: me.$t('mes.labels.Designer')},
                { index: 1, id: 'preview', name: me.$t('mes.labels.Preview')}
            ],
            selectedTab: 0,
            constructorCaption: this.$t('mes.labels.FormContructor'),
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
        return Object.keys(this.formDefinition).length ? this.$t('mes.buttons.Save') : this.$t('mes.buttons.Create');
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
    .formio-builder-component-class::v-deep {
        @import './assets/theme.scss';
        @import "~formiojs/dist/formio.full.min.css";
        @import "~bootstrap/scss/bootstrap";
        @import './assets/overide.scss';
        @import "~choices.js/public/assets/styles/choices.css";
        @import "~flatpickr/dist/flatpickr.min.css";

        font-family: Roboto;
    }

    .formio-form-component {
        position: relative;
    }

    .formio-builder-component-class {
        overflow-y: auto !important;
        position: absolute;
        top: 145px;
        bottom: 10px;
        right: 32px;
        left: 32px;
        padding: 0 16px;
    }
    .constructor-title {
        padding-left: 10px;
        display: block;
        width: 100%;
        font-size: 1.25rem !important;
        font-weight: 500;
        line-height: 2rem;
        letter-spacing: 0.0125em !important;
        font-family: "Roboto", sans-serif !important;
        z-index: 102;
    }
    .toolbar-builder-container {
        overflow: hidden;
        padding: 0 40px;
        position: relative;
    }
    .builder-component {
        text-align: left;
    }
    .toolbar {
        width: 100%;
        margin: 9px 0 0 0;
    }
    .toolbar-item {
        padding: 0 5px;
    }
    .form-code-text-field {
        max-width: 200px;
    }
    .form-display-type-field {
        max-width: 200px;
    }
    .form-name-text-field {
      max-width: 350px;
    }
    .form-preview-component {
        overflow-y: auto !important;
        position: absolute;
        top: 125px;
        bottom: 10px;
        right: 32px;
        left: 32px;
        padding: 0 16px;
    }

    .button-container {
        margin-left: auto;
    }

    .form-preview-component::-webkit-scrollbar {
        background-color:#fff;
        width:16px
    }
    /* background of the scrollbar except button or resizer */
    .form-preview-component::-webkit-scrollbar-track {
        background-color:#fff
    }
    .form-preview-component::-webkit-scrollbar-track:hover {
        background-color:#f4f4f4
    }

    /* scrollbar itself */
    .form-preview-component::-webkit-scrollbar-thumb {
        background-color:#babac0;
        border-radius:16px;
        border:5px solid #fff
    }
    .form-preview-component::-webkit-scrollbar-thumb:hover {
        background-color:#a0a0a5;
        border:4px solid #f4f4f4
    }
    /* set button(top and bottom of the scrollbar) */
    .form-preview-component::-webkit-scrollbar-button {display:none}

  //formio-builder-component-class
    .formio-builder-component-class::-webkit-scrollbar {
        background-color:#fff;
        width:16px
    }
    /* background of the scrollbar except button or resizer */
    .formio-builder-component-class::-webkit-scrollbar-track {
        background-color:#fff
    }
    .formio-builder-component-class::-webkit-scrollbar-track:hover {
        background-color:#f4f4f4
    }

    /* scrollbar itself */
    .formio-builder-component-class::-webkit-scrollbar-thumb {
        background-color:#babac0;
        border-radius:16px;
        border:5px solid #fff
    }
    .formio-builder-component-class::-webkit-scrollbar-thumb:hover {
        background-color:#a0a0a5;
        border:4px solid #f4f4f4
    }
    /* set button(top and bottom of the scrollbar) */
    .formio-builder-component-class::-webkit-scrollbar-button {display:none}
</style>
