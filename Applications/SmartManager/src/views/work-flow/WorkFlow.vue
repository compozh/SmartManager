<template>
  <div
    class="app-fixed-height border border-solid d-theme-border-grey-light rounded relative overflow-hidden"
  >
    <VuePerfectScrollbar
      class="scroll-area"
      :settings="settings"
    >
      <div class="vx-row form-container">
        <div class="vx-col w-full h-full">
          <vx-card>
            <!-- TASK APPROVALS -->
            <div class="vx-row">
              <div class="vx-col w-full">
                <!-- add task -->
                <form @submit.prevent>
                  <sm-autocomplete :items="businessProcesses"
                                   :multiple="false"
                                   :loading="bpListLoading"
                                   v-model="businessProcess"
                                   @input="getFormDefinition"
                                   label="name"
                                   :placeholder="$t('workflow.businessProcess')"
                                   name="businessProcess"
                                   v-validate="'required'"
                  />
                  <span v-if="errors.has('businessProcess')"
                        class="required-text"
                  >{{ $t('validate.required') }}
                  </span>
                  <vs-divider></vs-divider>

                    <formio id="formio"
                            class="formio-container"
                            :src="form"
                            :form="form"

                    />

                  <vs-divider></vs-divider>
                  <div class="flex justify-end">
                    <vs-button class="mx-6"
                               color="primary"
                               type="flat"
                               @click="$router.go(-1)"
                    >{{ $t('buttons.cancel') }}
                    </vs-button>
                    <vs-button
                      type="gradient"
                    >{{ $t('buttons.start') }}
                    </vs-button>
                  </div>
                </form>
              </div>
            </div>
            {{ form }}
          </vx-card>
        </div>
      </div>
    </VuePerfectScrollbar>
  </div>
</template>
<script>

import SmAutocomplete from '../../components/SmAutocomplete'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { Form } from 'vue-formio'

export default {
  components: {
    VuePerfectScrollbar,
    SmAutocomplete,
    formio: Form,
  },
  props: {

  },
  data: () => ({
    bpListLoading: false,
    businessProcess: null,
    formDefinition: null,
    options: { noAlerts: true },
    settings: {
      maxScrollbarLength: 60,
      wheelSpeed: 0.30,
    }
  }),
  computed: {
    businessProcesses() {
      return this.$store.state.sm.businessProcesses
    },
    form() {
      return {
        display: 'form',
        components: this.formDefinition
          ? JSON.parse(this.formDefinition)
          : []
      }
    }
  },
  created() {
    this.getBusinessProcesses()
  },
  methods: {
    async getBusinessProcesses() {
      this.bpListLoading = true
      const bp = this.$store.state.sm.businessProcesses
      if (bp.length === 0) {
        await this.$store.dispatch('sm/getBusinessProcesses')
      }
      this.bpListLoading = false
    },
    async getFormDefinition(bp) {
      const result = await this.$store.dispatch(
        'sm/getFormDefinition', bp.deployId
      )
      this.formDefinition = result ? result : null
    },
  }
}
</script>

<style scoped lang="scss">

  .form-container {
    margin: 15px 0;
  }
  .formio-container {
    /*@import "~bootstrap/scss/bootstrap.scss";*/
    @import "~choices.js/public/assets/styles/choices.css";
    @import "~flatpickr/dist/flatpickr.min.css";

    font-size: 14px;
    font-weight: 500;
    label {
      margin-top: .5rem !important;
      font-size: 16px;
    }
    .row.formio-component.formio-component-columns{
      padding: 0 5px;
    }
    .form-group.has-feedback.formio-component-submit {
      margin-top: 1rem;
    }
    .editgrid-add {
      margin: 1rem;
    }
    .btn.btn-default.btn-sm.editRow {
      width: 50px;
      border: 1px solid #326DA8;
      color: #326DA8;
      height: 50px;
    }
    .btn.btn-default.btn-sm.editRow:hover{
      background-color: rgba(50, 109, 168, .12);
    }
    .btn.btn-danger {
      background: white;
      border: 1px solid rgba(179, 2, 2, 0.81);
      color: rgba(179, 2, 2, 0.81);
      height:50px;
    }
    .btn.btn-danger:active, .btn.btn-danger:focus {
      outline: none !important;
      box-shadow: none;
    }
    .btn.btn-danger::-moz-focus-inner {
      border: 0;
    }
    .btn.btn-danger:hover {
      background-color: rgba(179, 2, 2, 0.12);
      height:50px;
    }
    .table.datagrid-table.table-bordered thead {
      font-size: 16px;
    }
    .list-group-item.list-group-header.formio-edit-grid-header {
      font-size: 16px;
    }
    .form-group.has-feedback.formio-component.formio-component-radio {
      display: flex;
      flex-direction: column;
      align-items: start;
    }
    .form-group.has-feedback.formio-component.formio-component-radio .form-group {
      align-items: start;
      display: flex;
      flex-direction: column;
    }
    .form-group.has-feedback.formio-component.formio-component-select {
      display: flex;
      flex-direction: column;
      align-items: start;
    }
    .form-group.has-feedback.formio-component.formio-component-select .choices.form-group.formio-choices {
      min-width: 350px;
    }
    .list-group-item .btn-group.pull-right {
      width: 300px;
    }
    .nav-link {
      display: flex;
      color: #495057;
      height: 50px;
      font-size: 16px;
      justify-content: center;
      align-items: center;
    }
    .nav-link.active {
      color: #326DA8 !important;
    }
    .nav-item.active {
      color: #326DA8;
    }
    .btn.btn-primary.btn-md {
      background-color: white;
      border-color: #326DA8;
      color: #326DA8;
      height: 50px;
      padding-top: 8px;
    }
    .btn.btn-primary {
      background-color: white;
      border-color: #326DA8;
      color: #326DA8;
      height: 50px;
    }
    .btn.btn-primary:active, .btn.btn-primary:focus {
      outline: none !important;
      box-shadow: none;
    }
    .btn.btn-primary:hover {
      background-color:  rgba(50, 109, 168, .12);
      color: #326DA8;
    }
    .btn {
      font-size: 14px;
      font-weight: 500;
      text-transform: uppercase;
      padding-top: 6px;
      outline: none !important;
    }
    .btn.btn-primary.btn-md:hover {
      background-color: rgba(50, 109, 168, .12)
    }
    .btn.btn-success.btn-lg {
      background-color: white;
      border-color: rgba(40, 165, 69, 1);
      color: rgba(40, 165, 69, 1);
      height: 50px;
      width: 55px;
      padding: 0;
    }
    .btn.btn-success:active, .btn.btn-success:focus {
      outline: none !important;
      box-shadow: none;
    }
    .btn.btn-success.btn-lg:hover {
      background-color:  rgba(40, 165, 69, .12);
      color:rgba(40, 165, 69, 1);
    }
    .form-group.has-feedback.formio-component {
      text-align: start;
    }
    .form-group.has-feedback.formio-component.formio-component-button.formio-component-submit.form-group {
      text-align: center;
    }
    .editgrid-add {
      text-align: center;
    }
    .editgrid-actions{
      text-align: center;
    }
    .row.formio-component.formio-component-columns.formio-component-columns {
      display: flex;
      justify-content: space-around;
    }
    /*input MD*/
    .form-control {
      border: none;
      border-bottom: 1px solid rgba(0, 0, 0, 0.42);
      border-radius: 0;
      outline: none;
      transition: 0.5s ease all;
      -moz-transition: 0.5s ease all;
      -webkit-transition: 0.5s ease all;
    }
    .form-control:focus {
      outline: none;
      box-shadow: none;
      border-bottom: 2px solid #326da8;
      transition: 0.5s ease all;
      -moz-transition: 0.5s ease all;
      -webkit-transition: 0.5s ease all;
    }
    .form-control[disabled="disabled"] {
      border: none;
    }
    /*checkbox MD*/
    .control-label.form-check-label {
      margin: 16px 0;
      display: block;
      cursor: pointer;
      input {
        display: none;
        & + span {
          line-height: 20px;
          height: 20px;
          padding-left: 20px;
          display: block;
          position: relative;
          &:not(:empty) {
            padding-left: 20px + 8;
          }
          &:before,
          &:after {
            content: '';
            width: 20px;
            height: 20px;
            display: block;
            border-radius: 50%;
            left: 0;
            top: 0;
            position: absolute;
          }
          &:before {
            background: #D1D7E3;
            transition: background .2s ease, transform .4s cubic-bezier(.175, .885, .32, 2);
          }
          &:after {
            background: #fff;
            transform: scale(.78);
            transition: transform .6s cubic-bezier(.175, .885, .32, 1.4);
          }
        }
        &:checked + span {
          &:before {
            transform: scale(1.04);
            background: #326da8;
          }
          &:after {
            transform: scale(.4);
            transition: transform .3s ease;
          }
        }
      }
      &:hover {
        input {
          & + span {
            &:before {
              transform: scale(.92);
            }
            &:after {
              transform: scale(.74);
            }
          }
          &:checked + span {
            &:after {
              transform: scale(.4);
            }
          }
        }
      }
    }
  }

</style>
