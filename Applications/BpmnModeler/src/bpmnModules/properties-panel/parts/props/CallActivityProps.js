import { PropertiesPanelGroup } from '../../Models';
import EntryFactory from '../../EntryFactory';
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { api } from '../../../../api/bpmnApi';
import * as cmdHelper from '../../helpers/CmdHelper';
import * as extensionElementsHelper from '../../helpers/ExtensionElementsHelper';
import elementHelper from '../../helpers/ElementHelper';
import { eventBus } from '../../../../main';
import { events } from '../../../../constants';

/**
 * 
 * @param {PropertiesPanelGroup} group 
 * @param {Object} element 
 * @param {EntryFactory} entryFactory 
 * @param {object} bpmnFactory 
 * @param {Function} translate 
 */
export default function addCallActivityProps(group, element, entryFactory, bpmnFactory, commandStack, translate) {
  if (!is(element, 'bpmn:CallActivity')) {
    return;
  }
  const required = (element, value) => { if (typeof value !== 'string' || value === '') { return translate('Must provide a value'); } return true; };
  const bo = getBusinessObject(element);

  group.entries.push(entryFactory.autocompleteBox({
    id: 'callable-element',
    label: translate('Called Element'),
    model: 'calledElement',
    loadItems: (async () => (await api.getDeployedProcesses())
      .map(process => { return { id: process.procDefKey, name: process.procName } })
      .filter((process, index, self) => self.indexOf(process) === index))(),
    set: (element, value) => {
      if (!value) {
        return [
          cmdHelper.updateBusinessObject(element, bo, {
            'calledElement': undefined,
            'camunda:calledElementBinding': undefined,
            'camunda:calledElementVersion': undefined
          }),
          ...deleteBusinessKey(element)
        ]
      }
      return [
        cmdHelper.updateBusinessObject(element, bo, {
          'calledElement': value
        }),
        ...setBusinessKey(element, '#{execution.processBusinessKey}', bpmnFactory)
      ]
    },
    validate: required,
    appendIcon: 'search',
    append: () => {
      eventBus.$emit(events.propertiesPanel.selectDeployedProcess, bo.calledElement, (procDefKey) => {
        const cmd = cmdHelper.updateBusinessObject(element, bo, { 'calledElement': procDefKey });
        commandStack.execute(cmd.cmd, cmd.context);
      });
    }
  }));

  if (typeof bo.calledElement === 'string' && bo.calledElement !== '') {
    group.entries.push(entryFactory.selectBox({
      id: 'calledElementBinding',
      label: translate('Binding'),
      model: 'camunda:calledElementBinding',
      items: [{ value: 'latest', name: translate('Latest') }, { value: 'version', name: translate('Version') }],
      get: () => {
        const value = bo.get('camunda:calledElementBinding');
        if (value === 'version') {
          return value;
        }
        return 'latest';
      },
      set: (element, value) => {
        if (value === 'version') {
          return cmdHelper.updateBusinessObject(element, bo, { 'camunda:calledElementBinding': value, 'camunda:calledElementVersion': undefined });
        }
        return cmdHelper.updateBusinessObject(element, bo, { 'camunda:calledElementBinding': undefined, 'camunda:calledElementVersion': undefined });
      },
      validate: required
    }));

    const binding = bo.get('camunda:calledElementBinding');
    if (binding === 'version') {
      group.entries.push(entryFactory.autocompleteBox({
        id: 'version',
        label: translate('Version'),
        model: 'camunda:calledElementVersion',
        loadItems: (async () => (await api.getDeployedProcesses())
          .filter(process => process.procDefKey === bo.calledElement)
          .map(process => { return { id: process.procDefVer.toString(), name: process.procDefVer } }))(),
        set: (element, value) => {
          if (!value) {
            return cmdHelper.updateBusinessObject(element, bo, { 'camunda:calledElementVersion': undefined });
          }
          return cmdHelper.updateBusinessObject(element, bo, { 'camunda:calledElementVersion': value });
        },
        validate: required
      }))
    }
  }
}

function getCamundaInWithBusinessKey(element) {
  var camundaIn = [],
    bo = getBusinessObject(element);

  var camundaInParams = extensionElementsHelper.getExtensionElements(bo, 'camunda:In');
  if (Array.isArray(camundaInParams)) {
    camundaInParams.forEach(function (param) {
      
      if (param.businessKey !== undefined
        // TODO: после добавления вкладки Variables что то с этим сделать
        || param.valiablles === 'all') {
        camundaIn.push(param);
      }
    });
  }
  return camundaIn;
}

function setBusinessKey(element, text, bpmnFactory) {
  var commands = [];

  var camundaInWithBusinessKey = getCamundaInWithBusinessKey(element);

  if (camundaInWithBusinessKey.length) {
    commands.push(cmdHelper.updateBusinessObject(element, camundaInWithBusinessKey[0], {
      businessKey: text
    }));
  } else {
    var bo = getBusinessObject(element),
      extensionElements = bo.extensionElements;

    if (!extensionElements) {
      extensionElements = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory);
      commands.push(cmdHelper.updateProperties(element, { extensionElements: extensionElements }));
    }

    var camundaIn = elementHelper.createElement(
      'camunda:In',
      { 'businessKey': text },
      extensionElements,
      bpmnFactory
    );

    var allIn = elementHelper.createElement(
      'camunda:In',
      { 'valiables': 'all' },
      extensionElements,
      bpmnFactory
    );

    var allOut = elementHelper.createElement(
      'camunda:Out',
      { 'valiables': 'all' },
      extensionElements,
      bpmnFactory
    );

    commands.push(cmdHelper.addAndRemoveElementsFromList(
      element,
      extensionElements,
      'values',
      'extensionElements',
      [camundaIn, allIn, allOut], []
    ));
  }

  return commands;
}

function deleteBusinessKey(element) {
  var camundaInExtensions = getCamundaInWithBusinessKey(element);
  var commands = [];
  camundaInExtensions.forEach(function (elem) {
    commands.push(extensionElementsHelper.removeEntry(getBusinessObject(element), element, elem));
  });
  return commands;
}