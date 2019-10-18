import inherits from 'inherits';
import PropertiesActivator from 'bpmn-js-properties-panel/lib/PropertiesActivator';
import ImplementationTypeHelper from 'bpmn-js-properties-panel/lib/helper/ImplementationTypeHelper';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { is } from 'bpmn-js/lib/util/ModelUtil';

// Require all properties you need from existing providers.
// In this case all available bpmn relevant properties without camunda extensions.
import processProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/ProcessProps';
import eventProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/EventProps';
import linkProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/LinkProps';
import documentationProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/DocumentationProps';
import idProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/IdProps';
import nameProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/NameProps';
import executableProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/ExecutableProps';
import serviceTaskDelegateProps from './parts/ServiceTaskDelegateProps';
import externalTaskConfiguration from 'bpmn-js-properties-panel/lib/provider/camunda/parts/ExternalTaskConfigurationProps';
import userTaskProps from './parts/UserTaskProps';

import formProps from './parts/FormProps';

var isExternalTaskPriorityEnabled = function (element) {
  var businessObject = getBusinessObject(element);

  // show only if element is a process, a participant ...
  if (is(element, 'bpmn:Process') || is(element, 'bpmn:Participant') && businessObject.get('processRef')) {
    return true;
  }

  var externalBo = ImplementationTypeHelper.getServiceTaskLikeBusinessObject(element),
    isExternalTask = ImplementationTypeHelper.getImplementationType(externalBo) === 'external';

  // ... or an external task with selected external implementation type
  return !!ImplementationTypeHelper.isExternalCapable(externalBo) && isExternalTask;
};

function createGeneralTabGroups(
  element, canvas, bpmnFactory,
  elementRegistry, elementTemplates, translate, commandStack) {

  var generalGroup = {
    id: 'general',
    label: translate('General'),
    entries: []
  };
  idProps(generalGroup, element, translate);
  nameProps(generalGroup, element, bpmnFactory, canvas, translate);
  processProps(generalGroup, element, translate);
  executableProps(generalGroup, element, translate);

  var detailsGroup = {
    id: 'details',
    label: translate('Config'),
    entries: []
  };
  userTaskProps(detailsGroup, element, bpmnFactory, translate, commandStack);
  serviceTaskDelegateProps(detailsGroup, element, bpmnFactory, translate, commandStack);
  linkProps(detailsGroup, element, translate);
  eventProps(detailsGroup, element, bpmnFactory, elementRegistry, translate);

  var externalTaskGroup = {
    id: 'externalTaskConfiguration',
    label: translate('External Task Configuration'),
    entries: [],
    enabled: isExternalTaskPriorityEnabled
  };
  externalTaskConfiguration(externalTaskGroup, element, bpmnFactory, translate);

  var documentationGroup = {
    id: 'documentation',
    label: translate('Item description'),
    entries: []
  };

  documentationProps(documentationGroup, element, bpmnFactory, translate);

  return [
    generalGroup,
    detailsGroup,
    externalTaskGroup,
    documentationGroup
  ];

}

function createFormsTabGroups(element, bpmnFactory, elementRegistry, translate, commandStack) {
  var formGroup = {
    id: 'forms',
    label: translate('Forms'),
    entries: []
  };
  formProps(formGroup, element, bpmnFactory, translate, commandStack);

  return [
    formGroup
  ];
}

export default function WorkflowPropertiesProvider(
  eventBus, canvas, bpmnFactory,
  elementRegistry, elementTemplates, translate, commandStack) {

  PropertiesActivator.call(this, eventBus);

  this.getTabs = function (element) {

    var generalTab = {
      id: 'general',
      label: translate('General'),
      groups: createGeneralTabGroups(
        element, canvas, bpmnFactory,
        elementRegistry, elementTemplates, translate, commandStack)
    };

    var formsTab = {
      id: 'forms',
      label: translate('Forms'),
      groups: createFormsTabGroups(element, bpmnFactory, elementRegistry, translate, commandStack)
    };

    return [
      generalTab,
      formsTab
    ];
  };

}

WorkflowPropertiesProvider.$inject = [
  'eventBus',
  'canvas',
  'bpmnFactory',
  'elementRegistry',
  'elementTemplates',
  'translate',
  'commandStack'
];

inherits(WorkflowPropertiesProvider, PropertiesActivator);