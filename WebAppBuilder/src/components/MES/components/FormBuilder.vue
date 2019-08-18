<template>
    <formio id="formio" class="formio-container"
      :form=formioComponents
      :submission=formioSubmission
      :options="options"
      @submit=onSubmit
      @change=onChange
    />
</template>

<script>
import {mapGetters} from 'vuex'
import { Form } from 'vue-formio';

export default {
	name: "mes-form-builder",
	components: { formio: Form },
	data() {
		return { options: { noAlerts: true }, currentData: '' };
	},
	computed: {
		formioComponents() {
			return { components: this.productionFormio ? JSON.parse(this.productionFormio.form) : [] };
		},
		formioSubmission() {
			return { data: this.productionFormio ? JSON.parse(this.productionFormio.data) : [] };
		},
		productionFormio() {
			return this.$store.getters['mes/productionFormio'];
		}
	},
	methods: {
		onSubmit(params) {
			this.$emit('formioSubmit', JSON.stringify(params.data));
		},
		onChange(params) {
			this.currentData = params.data;
		},
		getFormioData() {
			return JSON.stringify(this.currentData)
		}
	}
}
</script>

<style scoped lang="scss">
.formio-container /deep/ {
  @import "~bootstrap/dist/css/bootstrap.min";
  @import "~choices.js/public/assets/styles/choices.css";
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
  }
  .btn.btn-default.btn-sm.editRow:hover{
    background-color: rgba(50, 109, 168, .12);
  }
  .btn.btn-danger {
    background: white;
    border: 1px solid rgba(179, 2, 2, 0.81);
    color: rgba(179, 2, 2, 0.81);
  }
  .btn.btn-danger:hover {
    background-color: rgba(179, 2, 2, 0.12);
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
    color: #326DA8;
  }
  .btn.btn-primary.btn-md {
    background-color: white;
    border-color: #326DA8;
    color: #326DA8;
  }
  .btn.btn-primary {
    background-color: white;
    border-color: #326DA8;
    color: #326DA8;
  }
  .btn.btn-primary:hover {
    background-color:  rgba(50, 109, 168, .12);
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
  }
  .btn.btn-success.btn-lg:hover {
    background-color:  rgba(40, 165, 69, .12);
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
}
</style>