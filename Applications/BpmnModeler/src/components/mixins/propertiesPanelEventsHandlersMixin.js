import { Notification } from 'element-ui';
import { eventBus } from '../../main';
import { events } from '../../constants';
import ActionDefinitionType from '../../api/models/ActionDefinitionType';
import FormioUtils from 'formiojs/utils';

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
    eventBus.$on(events.propertiesPanel.setBusinessObjectActionProperties, this.onPropertiesPanelSetBusinessObjectActionProperties);
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
    eventBus.$off(events.propertiesPanel.setBusinessObjectActionProperties, this.onPropertiesPanelSetBusinessObjectActionProperties);
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

      eventBus.$emit(events.modeler.showSelectionAssistant,
        items,
        'testASD',
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
      this.propertiesPanelShowForm(form, action.unformio, existingParameters, callback);
    },
    async onPropertiesPanelSetBusinessObjectActionProperties(logicalKey, existingParameters, callback) {
      this.loading = true;
      const form = await this.$store.dispatch('bpmn/getBusinessObjectActionForm', logicalKey);
      this.propertiesPanelShowForm(form, undefined, existingParameters, callback);
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
    },
    propertiesPanelShowForm(form, unformio, existingParameters, callback) {
      if (!form) {
        this.changeLoad();
        Notification.error(this.$t('bpmn.errors.FormNotLoaded'));
        return;
      }

      const submission = {};
      if (existingParameters && existingParameters.length) {
        for (let index = 0; index < existingParameters.length; index++) {
          const element = existingParameters[index];
          if (element.type === 'object') {
            try {
              submission[element.name] = JSON.parse(element.value);
            } catch {
              Notification.error(this.$t('bpmn.errors.FormParameterImportError', { name: element.name }));
            }
          } else {
            submission[element.name] = element.value;
          }
        }
      }
      form.submission = JSON.stringify(submission);
      this.changeLoad();

      eventBus.$emit(events.formio.showForm, unformio, form, this.$t('bpmn.labels.EnterTaskParams'), (submission) => {
        const params = [];
        for (var param in submission.data) {
          const value = submission.data[param];
          let type = typeof value;
          if (type === 'string') {
            const component = FormioUtils.getComponent(typeof form.components === 'string' ? JSON.parse(form.components) : form.components, param);
            if (component.type === 'number' || component.type === 'datetime') {
              type = component.type;
            }
          }
          params.push({ name: param, type: type, value: typeof value === 'object' ? JSON.stringify(value) : value });
        }
        callback(params);
      });
    }
  }
};
