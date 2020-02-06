import { Notification } from 'element-ui';
import { eventBus } from '../../main';
import { events } from '../../constants';
import ActionDefinitionType from '../../api/models/ActionDefinitionType';

export default {
  mounted() {
    eventBus.$on(events.propertiesPanel.setServiceTaskProperties, this.onPropertiesPanelSetExternalTaskProperties);
    eventBus.$on(events.propertiesPanel.selectAction, this.onPropertiesPanelSelectTask);
    eventBus.$on(events.propertiesPanel.selectForm, this.onPropertiesPanelSelectFormKey);
    eventBus.$on(events.propertiesPanel.selectDeployedProcess, this.onPropertiesPanelSelectDeployedProcess);
    eventBus.$on(events.propertiesPanel.selectDeployedDecision, this.onPropertiesPanelSelectDeployedDecision);
  },
  beforeDestroy() {
    eventBus.$off(events.propertiesPanel.setServiceTaskProperties, this.onPropertiesPanelSetExternalTaskProperties);
    eventBus.$off(events.propertiesPanel.selectAction, this.onPropertiesPanelSelectTask);
    eventBus.$off(events.propertiesPanel.selectForm, this.onPropertiesPanelSelectFormKey);
    eventBus.$off(events.propertiesPanel.selectDeployedProcess, this.onPropertiesPanelSelectDeployedProcess);
    eventBus.$off(events.propertiesPanel.selectDeployedDecision, this.onPropertiesPanelSelectDeployedDecision);
  },
  methods: {
    async onPropertiesPanelSelectTask(taskCode, definitionType, callback) {
      this.loading = true;
      var items = await this.$store.dispatch('bpmn/getAvailableActions', { processId: this.activeItem, definitionType });
      if (!items) {
        this.loading = false;
        Notification.error(this.$t('bpmn.errors.ActionsNotLoaded'));
        return;
      }
      this.loading = false;

      eventBus.$emit(events.modeler.showSelectionGrid,
        ActionDefinitionType.UserTask ? this.$t('bpmn.labels.SelectTaskCreationRule') : this.$t('bpmn.labels.SelectAction'),
        items, items.find(item => item.id === taskCode),
        (selectedItem) => callback(selectedItem.id));
    },
    async onPropertiesPanelSelectFormKey(formKey, callback) {
      this.loading = true;
      var items = await this.$store.dispatch('bpmn/getFormsForProcess', { processId: this.activeItem });
      if (!items) {
        this.loading = false;
        Notification.error(this.$t('bpmn.errors.FormsNotLoaded'));
        return;
      }
      this.loading = false;

      eventBus.$emit(events.modeler.showSelectionGrid,
        this.$t('bpmn.labels.SelectForm'),
        items, items.find(item => item.id === formKey),
        (selectedItem) => callback(selectedItem.id));
    },
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
      this.loading = false;

      eventBus.$emit(events.formio.showForm, action.unformio, form, (submission) => {
        var params = [];
        for (var param in submission.data) {
          params.push({ name: param, type: typeof (submission.data[param]), value: submission.data[param] });
        }
        callback(params);
      });
    },
    async onPropertiesPanelSelectDeployedProcess(procDefKey, callback) {
      this.loading = true;
      var items = await this.$store.dispatch('bpmn/getDeployedProcesses');
      if (!items) {
        this.loading = false;
        Notification.error(this.$t('bpmn.errors.ElementsNotLoaded'));
        return;
      }
      this.loading = false;
      items = items
        .map(process => { return { id: process.procDefKey, name: process.procName }; })
        .filter((process, index, self) => self.findIndex(p => p.id === process.id) === index);

      eventBus.$emit(events.modeler.showSelectionGrid,
        this.$t('bpmn.labels.SelectProcess'),
        items, items.find(item => item.id === procDefKey),
        (selectedItem) => callback(selectedItem.id));
    }
    ,
    async onPropertiesPanelSelectDeployedDecision(decDefKey, callback) {
      this.loading = true;
      var items = await this.$store.dispatch('bpmn/getDeployedDecisions');
      if (!items) {
        this.loading = false;
        Notification.error(this.$t('bpmn.errors.ElementsNotLoaded'));
        return;
      }
      this.loading = false;
      items = items
        .map(decision => { return { id: decision.decDefKey, name: decision.decDefName }; })
        .filter((decision, index, self) => self.findIndex(p => p.id === decision.id) === index);

      eventBus.$emit(events.modeler.showSelectionGrid,
        this.$t('bpmn.labels.SelectDecisionTable'),
        items, items.find(item => item.id === decDefKey),
        (selectedItem) => callback(selectedItem.id));
    }
  }
};