<template>
    <formio id="formio" class="formio-container"
		:form=formioComponents
		:submission=formioSubmission
		:options="options"
		@submit=onSubmit
		@change=onChange />
</template>

<script>
import {mapGetters} from 'vuex'
import { Form } from '../../../../node_modules/vue-formio';

export default {
	name: "mes-form-builder",
	components: { formio: Form },
	props: {
    	workCenter: Object
	},
	data() {
		return { options: { noAlerts: true }, currentData: '' };
	},
	computed: {
		formioComponents() {
			return { components: this.formioData ? JSON.parse(this.formioData.form) : [] };
		},
		formioSubmission() {
			return { data: this.formioData ? JSON.parse(this.formioData.data) : [] };
		},
		formioData() {
     		return this.productionFormio[this.workCenter.productionRegistrationFormCode];
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
    background-color: #007bff;
    color: white;
  }
  .btn.btn-default.btn-sm.editRow:hover{
    background-color: #015bbb;
  }
  .table.datagrid-table.table-bordered thead {
    font-size: 16px;
  }
  .list-group-item.list-group-header.formio-edit-grid-header {
    font-size: 16px;
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
}
</style>