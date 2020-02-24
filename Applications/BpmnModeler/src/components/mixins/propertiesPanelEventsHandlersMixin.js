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
    eventBus.$on(events.propertiesPanel.selectDeployedCase, this.onPropertiesPanelSelectDeployedCase);
    eventBus.$on(events.propertiesPanel.selectBusinessObject, this.onPropertiesPanelSelectBusinessObject);
    eventBus.$on(events.propertiesPanel.selectBusinessObjectAccess, this.onPropertiesPanelSelectBusinessObjectAccess);
    eventBus.$on(events.propertiesPanel.selectBusinessObjectAction, this.onPropertiesPanelSelectBusinessObjectAction);
  },
  beforeDestroy() {
    eventBus.$off(events.propertiesPanel.setServiceTaskProperties, this.onPropertiesPanelSetExternalTaskProperties);
    eventBus.$off(events.propertiesPanel.selectAction, this.onPropertiesPanelSelectTask);
    eventBus.$off(events.propertiesPanel.selectForm, this.onPropertiesPanelSelectFormKey);
    eventBus.$off(events.propertiesPanel.selectDeployedProcess, this.onPropertiesPanelSelectDeployedProcess);
    eventBus.$off(events.propertiesPanel.selectDeployedDecision, this.onPropertiesPanelSelectDeployedDecision);
    eventBus.$off(events.propertiesPanel.selectDeployedCase, this.onPropertiesPanelSelectDeployedCase);
    eventBus.$off(events.propertiesPanel.selectBusinessObject, this.onPropertiesPanelSelectBusinessObject);
    eventBus.$off(events.propertiesPanel.selectBusinessObjectAccess, this.onPropertiesPanelSelectBusinessObjectAccess);
    eventBus.$off(events.propertiesPanel.selectBusinessObjectAction, this.onPropertiesPanelSelectBusinessObjectAction);
  },
  methods: {
    async onPropertiesPanelSelectTask(taskCode, definitionType, callback) {
      this.loading = true;
      var items = await this.$store.dispatch('bpmn/getAvailableActions', { processId: this.activeItem, definitionType });
      if (!items) {
        this.changeLoad();
        Notification.error(this.$t('bpmn.errors.ActionsNotLoaded'));
        return;
      }
      this.changeLoad();

      eventBus.$emit(events.modeler.showSelectionGrid,
        ActionDefinitionType.UserTask ? this.$t('bpmn.labels.SelectTaskCreationRule') : this.$t('bpmn.labels.SelectAction'),
        items, items.find(item => item.id === taskCode),
        (selectedItem) => callback(selectedItem.id));
    },
    async onPropertiesPanelSelectFormKey(formKey, callback) {
      this.loading = true;
      var items = await this.$store.dispatch('bpmn/getFormsForProcess', { processId: this.activeItem });
      if (!items) {
        this.changeLoad();
        Notification.error(this.$t('bpmn.errors.FormsNotLoaded'));
        return;
      }
      this.changeLoad();

      eventBus.$emit(events.modeler.showSelectionGrid,
        this.$t('bpmn.labels.SelectForm'),
        items, items.find(item => item.id === formKey),
        (selectedItem) => callback(selectedItem.id));
    },
    async onPropertiesPanelSetExternalTaskProperties(taskCode, existingParameters, callback) {
      this.loading = true;
      var action = await this.$store.dispatch('bpmn/getActionById', taskCode);
      if (!action) {
        this.changeLoad();
        Notification.error(this.$t('bpmn.errors.ActionsNotLoaded'));
        return;
      }
      if (!action.unformio || action.unformio.trim() === '') {
        this.changeLoad();
        Notification.warning(this.$t('bpmn.errors.ActionWithoutForm'));
        return;
      }
      var form = await this.$store.dispatch('formio/getForm', { formCode: action.unformio });
      if (!form) {
        this.changeLoad();
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
      this.changeLoad();

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
        this.changeLoad();
        Notification.error(this.$t('bpmn.errors.ElementsNotLoaded'));
        return;
      }
      this.changeLoad();
      items = items
        .map(process => { return { id: process.procDefKey, name: process.procName }; })
        .filter((process, index, self) => self.findIndex(p => p.id === process.id) === index);

      eventBus.$emit(events.modeler.showSelectionGrid,
        this.$t('bpmn.labels.SelectProcess'),
        items, items.find(item => item.id === procDefKey),
        (selectedItem) => callback(selectedItem.id));
    },
    async onPropertiesPanelSelectDeployedDecision(decDefKey, callback) {
      this.loading = true;
      var items = await this.$store.dispatch('bpmn/getDeployedDecisions');
      if (!items) {
        this.changeLoad();
        Notification.error(this.$t('bpmn.errors.ElementsNotLoaded'));
        return;
      }
      this.changeLoad();
      items = items
        .map(decision => { return { id: decision.decDefKey, name: decision.decDefName }; })
        .filter((decision, index, self) => self.findIndex(p => p.id === decision.id) === index);

      eventBus.$emit(events.modeler.showSelectionGrid,
        this.$t('bpmn.labels.SelectDecisionTable'),
        items, items.find(item => item.id === decDefKey),
        (selectedItem) => callback(selectedItem.id));
    },
    async onPropertiesPanelSelectDeployedCase(caseDefKey, callback) {
      this.loading = true;
      var items = await this.$store.dispatch('bpmn/getDeployedCases');
      if (!items) {
        this.changeLoad();
        Notification.error(this.$t('bpmn.errors.ElementsNotLoaded'));
        return;
      }
      this.changeLoad();
      items = items
        .map(decision => { return { id: decision.caseDefKey, name: decision.caseName }; })
        .filter((decision, index, self) => self.findIndex(p => p.id === decision.id) === index);
      
      eventBus.$emit(events.modeler.showSelectionGrid,
        this.$t('bpmn.labels.SelectCase'),
        items, items.find(item => item.id === caseDefKey),
        (selectedItem) => callback(selectedItem.id));
    },
    async onPropertiesPanelSelectBusinessObject(boDefCode, onlySystem, callback, selectedBusinessObjects) {
      this.loading = true;
      var items = await this.$store.dispatch('bpmn/getBusinessObjects', onlySystem);
      if (!items) {
        this.changeLoad();
        Notification.error(this.$t('bpmn.errors.ElementsNotLoaded'));
        return;
      }
      this.changeLoad();
      items = items.map(bo => { return { id: bo.boDefCode, name: bo.name }; });
      if (Array.isArray(selectedBusinessObjects)) {
        items = items.filter(item => selectedBusinessObjects.indexOf(item.id) !== -1);
      }
      eventBus.$emit(events.modeler.showSelectionGrid,
        this.$t('bpmn.labels.SelectBusinessObject'),
        items, items.find(item => item.id === boDefCode),
        (selectedItem) => callback(selectedItem.id));
    },
    async onPropertiesPanelSelectBusinessObjectAction(boDefCode, actDefCode, onlySystem, callback) {
      this.loading = true;
      var items = await this.$store.dispatch('bpmn/getBusinessObjectActions', { boDefCode, onlySystem }, onlySystem);
      if (!items) {
        this.changeLoad();
        Notification.error(this.$t('bpmn.errors.ElementsNotLoaded'));
        return;
      }
      this.changeLoad();
      items = items.map(bo => { return { id: `${bo.boDefCode}.${bo.actionDefCode}`, name: bo.name }; });
      eventBus.$emit(events.modeler.showSelectionGrid,
        this.$t('bpmn.labels.SelectBusinessObjectAction'),
        items, items.find(item => item.id === actDefCode),
        (selectedItem) => callback(selectedItem.id));
    },
    async onPropertiesPanelSelectBusinessObjectAccess(boDefCode, accDefCode, onlySystem, callback) {
      this.loading = true;
      var items = await this.$store.dispatch('bpmn/getBusinessObjectAccess', { boDefCode, onlySystem});
      if (!items) {
        this.changeLoad();
        Notification.error(this.$t('bpmn.errors.ElementsNotLoaded'));
        return;
      }
      this.changeLoad();
      items = items.map(bo => { return { id: `${bo.boDefCode}.${bo.accessDefCode}`, name: bo.name }; });
      eventBus.$emit(events.modeler.showSelectionGrid,
        this.$t('bpmn.labels.SelectBusinessObjectAccess'),
        items, items.find(item => item.id === accDefCode),
        (selectedItem) => callback(selectedItem.id));
    }
  }
};