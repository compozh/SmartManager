<template>
  <v-dialog v-if="show" v-model="show" max-width="800px" :persistent="loading">
    <v-card>
      <v-card-title>
        <h4 class="headline mb-0">{{ $t('bpmn.labels.EnterTaskParams') }}</h4>
      </v-card-title>
      <v-card-text>
        <formio-component ref="formioForm" :formCode="code" :formDefinition="definition"></formio-component>
      </v-card-text>
      <v-card-actions>
        <v-btn flat @click="show = false" :disabled="loading">{{ $t('bpmn.buttons.Cancel') }}</v-btn>
        <v-btn flat @click="onSubmit" color="primary" :loading="loading">{{ $t('bpmn.buttons.Save') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { eventBus } from '../../main';
import { events } from '../../constants';

export default {
  name: 'formio-container',
  props: {
    show: Boolean,
    code: String,
    definition: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    async onSubmit() {
      var form = this.$refs.formioForm;
      var submission = JSON.parse(form.getFormSubmission());     
      this.loading = true;

      var result = await this.$store.dispatch('formio/submitForm', { formCode: this.code, submission: JSON.stringify(submission) });

      if (result && result.success) {
        this.$emit('submit', submission);
      }

      this.loading = false;
    }
  }
}
</script>
<style>

</style>