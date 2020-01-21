<template>
<!-- TODO: После перехода на vuetify 2 сменить v-flex на v-overlay -->
  <v-flex v-if="show" v-model="show">
    <div class="v-overlay v-overlay--active" style="z-index:201" />
    <div class="v-dialog__content v-dialog__content--active" style="z-index:202;">
			<v-card class="v-dialog v-dialog--active" max-width="800px">
        <v-card-title>
				<h4 class="headline mb-0">{{ $t('bpmn.labels.EnterTaskParams') }}</h4>
        </v-card-title>
        <formio-form-component ref="formioForm" :formCode="code" :formDefinition="definition"/>
        <v-card-actions>
				<v-spacer></v-spacer>
				<v-btn flat @click="show = false" :disabled="loading">{{ $t('bpmn.buttons.Cancel') }}</v-btn>
				<v-btn flat @click="onSubmit" color="primary" :loading="loading">{{ $t('bpmn.buttons.Save') }}</v-btn>
        </v-card-actions>
			</v-card>
	</div>
  </v-flex>
</template>
<script>
import { eventBus } from '../../main';
import { events } from '../../constants';

export default {
  name: 'formio-container',
  data() {
    return {
      loading: false,
      show: false,
      code: '',
      definition: null,
      callback: null
    }
  },
  mounted() {
    eventBus.$on(events.formio.showForm, this.onShowForm);
  },
  beforeDestroy() {
    eventBus.$off(events.formio.showForm, this.onShowForm);
  },
  methods: {
    onShowForm(code, definition, callback) {
      this.code = code;
      this.definition = definition;
      this.show = true;
      this.callback = callback;
    },
    async onSubmit() {
      var form = this.$refs.formioForm;
      var submission = JSON.parse(form.getFormSubmission());     
      this.loading = true;

      var result = await this.$store.dispatch('formio/submitForm', { formCode: this.code, submission: JSON.stringify(submission) });

      if (result && result.success) {
        this.$emit('submit', submission);
      }

      this.loading = false;
      
      if (this.callback) {
        this.callback(submission);
        this.callback = null;
      }
      this.show = false;
    }
  }
}
</script>
<style>
</style>