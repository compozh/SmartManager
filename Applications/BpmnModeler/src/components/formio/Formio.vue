<template>
    <v-overlay v-if="show" v-model="show" class="overlay-for-formio">
      <v-card width="800px" light class="dialog">
        <v-card-title>
          <h4 class="headline mb-0">{{ this.title }}</h4>
        </v-card-title>
        <formio-form-component ref="formioForm" :formCode="code" :formDefinition="definition"/>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="show = false" :disabled="loading">{{ $t('bpmn.buttons.Cancel') }}</v-btn>
          <v-btn text @click="onSubmit" color="primary" :loading="loading">{{ $t('bpmn.buttons.Save') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-overlay>
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
      callback: null,
      title: ''
    };
  },
  mounted() {
    eventBus.$on(events.formio.showForm, this.onShowForm);
  },
  beforeDestroy() {
    eventBus.$off(events.formio.showForm, this.onShowForm);
  },
  methods: {
    onShowForm(code, definition, title, callback) {
      this.code = code;
      this.definition = definition;
      this.show = true;
      this.callback = callback;
      this.title = title;
    },
    async onSubmit() {
      var form = this.$refs.formioForm;
      var submission = form.getFormSubmission();     
      this.loading = true;

      var result = typeof this.code === 'string' && this.code.trim() != ''
        ? await this.$store.dispatch('formio/submitForm', { formCode: this.code, submission: submission })
        : { success: true };

      if (result && result.success) {
        this.$emit('submit', JSON.parse(submission));
      }

      this.loading = false;
      
      if (this.callback) {
        this.callback(JSON.parse(submission));
        this.callback = null;
      }
      this.show = false;
    }
  }
};
</script>
<style scoped lang="scss">

</style>
<style lang="scss">
  .dialog{
    height: 90%;
  }
  .overlay-for-formio {
    z-index: 1003 !important; 
  }
</style>