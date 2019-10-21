import { eventBus } from '../../main';
import { events } from '../../constants';

export default {
  data() {
    return {
      formio: {
        callback: null,
        show: false,
        code: '',
        definition: {}
      }
    }
  },
  mounted() {
    eventBus.$on(events.propertiesPanel.setServiceTaskProperties, this.onPropertiesPanelSetExternalTaskProperties);
  },
  beforeDestroy() {
    eventBus.$off(events.propertiesPanel.setServiceTaskProperties, this.onPropertiesPanelSetExternalTaskProperties);
  },
  methods: {
    async onPropertiesPanelSetExternalTaskProperties(taskCode, existingParameters, callback) {
      this.loading = true;
      var action = await this.$store.dispatch('bpmn/getActionById', taskCode);
      if (!action) {
        this.loading = false;
        Notification.error(this.$t('bpmn.errors.ActionsNotLoaded'));
        return;
      }
      if (!action.unformio || action.unformio.trim() === '') {
        this.loading = false;
        Notification.warning(this.$t('bpmn.errors.ActionWithoutForm'));
        return;
      }
      var form = await this.$store.dispatch('formio/getForm', { formCode: action.unformio });
      if (!form) {
        this.loading = false;
        Notification.error(this.$t('bpmn.errors.FormNotLoaded'));
        return;
      }

      let submission = {};
      if (existingParameters && existingParameters.length) {
        for (let index = 0; index < existingParameters.length; index++) {
          const element = existingParameters[index];
          submission[element.name] = element.value;
        }
      }

      form.submission = JSON.stringify(submission);
      this.formio.code = action.unformio;
      this.formio.definition = form;
      this.formio.show = true;
      this.formio.callback = callback;

      this.loading = false;
    },
    async onFormioSubmit(submission) {
      var params = [];
      for (var param in submission.data) {
        params.push({ name: param, type: typeof (submission.data[param]), value: submission.data[param] });
      }
      this.formio.callback(params);
      this.formio.callback = null;
      this.formio.show = false;
    }
  }
}