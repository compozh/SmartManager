<template>
    <v-container>
        <v-layout row wrap>
            <v-btn
                outlined
                @click="onAction"
                class="toolbar-item"
            >
                {{actionText}}
            </v-btn>
            <v-btn
                outlined
                class="toolbar-item"
                @click="onCancel"
            >
                Отменить
            </v-btn>
            <v-text-field
                class="toolbar-item"
                :disabled="Boolean(Object.keys(formDefinition).length)"
                :value="formDefinition.formCode"
                :v-model="formCode"
                label="Код формы"
                @change=onFormCodeChange
                required
            />
            <v-text-field
                class="toolbar-item"
                :value="formDefinition.name"
                :v-model="formName"
                label="Наименование формы"
                @change=onFormNameChange
                required
            />
        </v-layout>
        <formbuilder
            class="formio-container"
            :form=formioComponents
            :options=options
            ref="formioComponent"
        />
    </v-container>
</template>

<script>
import { FormBuilder } from 'vue-formio'
import VueApexCharts from 'vue-apexcharts'
/* eslint-disable */
export default {
  name: 'formio-builder-component',
  components: { formbuilder: FormBuilder, apexchart: VueApexCharts },
  data() {
    return {
        formCode: '',
        formName: '',
        options: { noAlerts: true }
    }
  },
  props: {
    formDefinition: Object
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
        return Object.keys(this.formDefinition).length ? 'Сохранить' : 'Создать';     
    }
  },
  methods: {
    onChange(params) {
        this.$emit('change', this.getFormParams());
    },
    onAction() {
        this.$emit('action', this.getFormParams());
    },
    onCancel() {
        this.$emit('cancel', this.getFormParams());
    },
    getFormParams() {
        var me = this,
            form = this.$refs.formioComponent

        return {
            formCode: this.formDefinition.formCode || this.formCode,
            name: this.formDefinition.name || this.formName,
            display: form.form.display,
            components: JSON.stringify(form.form.components, null, 4),
            settings: JSON.stringify(form.form.settings, null, 4),
            //submission: JSON.stringify(form.submission, null, 4)
        }
    },
    onFormCodeChange(value) {
        this.formCode = value
    },
    onFormNameChange(value) {
        this.formName = value
    }
  }
}
</script>

<style scoped lang="scss">
    .formio-container /deep/ {
  @import "~bootstrap/scss/bootstrap.scss";
  @import "~choices.js/public/assets/styles/choices.css";
  @import "~flatpickr/dist/flatpickr.min.css";
    }
    .toolbar-item {
        padding: 0 5px;
    }
</style>
