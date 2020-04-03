import { PropertiesPanelGroup } from '../../../Models';
import EntryFactory from '../../../EntryFactory';
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { api } from '../../../../../api/bpmnApi';
import * as cmdHelper from '../../helpers/CmdHelper';
import * as extensionElementsHelper from '../../helpers/ExtensionElementsHelper';
import elementHelper from '../../helpers/ElementHelper';
import { eventBus } from '../../../../../main';
import { events } from '../../../../../constants';
import { concatCommands } from '../../../utils';

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

  group.entries.push(entryFactory.selectBox({
    id: 'activity-type',
    label: translate('Activity Type'),
    model: 'callActivityType',
    items: [{ name: 'BPMN', value: 'bpmn' }, { name: 'CMMN', value: 'cmmn' }],
    get: () => getCallableType(element),
    set: (element, value) => {
      var props = Object.assign({}, DEFAULT_PROPS);

      if (value === 'bpmn') {
        props.calledElement = '';
      } else if (value === 'cmmn') {
        props['camunda:caseRef'] = '';
      }

      return cmdHelper.updateProperties(element, props);
    }
  }));

  if (typeof bo.calledElement === 'string' || typeof bo.get('camunda:caseRef') === 'string') {
    group.entries.push(entryFactory.selectBox({
      id: 'binding-type',
      label: translate('Definition Mode'),
      model: 'IT-Enterprise:definitionMode',
      items: [
        { name: translate(typeof bo.calledElement === 'string' ? 'Called Process' : 'Called Case'), value: 'identifier' },
        { name: translate('Variable'), value: 'variable' },
        { name: translate('Expression'), value: 'expression' }
      ],
      get: () => {
        const value = bo.get('IT-Enterprise:definitionMode');
        if (typeof value !== 'string' || value.trim() == '') {
          return 'identifier';
        }
        return value;
      }
    }));
  }

  if (typeof bo.calledElement === 'string') {

    if (bo.get('IT-Enterprise:definitionMode') === 'variable') {
      group.entries.push(entryFactory.textField({
        id: 'callable-process',
        label: translate('Variable'),
        model: 'calledElement',
        get: () => {
          let value = bo.get('calledElement');
          if (typeof value === 'string') {
            if (value.startsWith('${')) {
              value = value.substring(2);
            }
            if (value.endsWith('}')) {
              value = value.substring(0, value.length - 1);
            }
          }
          return value;
        },
        set: (element, value) => {
          if (!value) {
            return [
              cmdHelper.updateBusinessObject(element, bo, {
                'calledElement': undefined,
                'camunda:calledElementBinding': undefined,
                'camunda:calledElementVersion': undefined,
                'IT-Enterprise:definitionMode': undefined,
                'IT-Enterprise:versionDefinitionMode': undefined
              }),
              ...deleteBusinessKey(element)
            ];
          }
          return [
            cmdHelper.updateBusinessObject(element, bo, {
              'calledElement': '${' + value + '}'
            }),
            ...setBusinessKey(element, '#{execution.processBusinessKey}', bpmnFactory)
          ];
        },
        validate: required
      }));
    } else if (bo.get('IT-Enterprise:definitionMode') === 'expression') {
      group.entries.push(entryFactory.textArea({
        id: 'callable-process',
        label: translate('Expression'),
        model: 'calledElement',
        set: (element, value) => {
          if (!value) {
            return [
              cmdHelper.updateBusinessObject(element, bo, {
                'calledElement': undefined,
                'camunda:calledElementBinding': undefined,
                'camunda:calledElementVersion': undefined,
                'IT-Enterprise:definitionMode': undefined,
                'IT-Enterprise:versionDefinitionMode': undefined
              }),
              ...deleteBusinessKey(element)
            ];
          }
          return [
            cmdHelper.updateBusinessObject(element, bo, {
              'calledElement': value
            }),
            ...setBusinessKey(element, '#{execution.processBusinessKey}', bpmnFactory)
          ];
        },
        validate: required
      }));
    } else {
      group.entries.push(entryFactory.autocompleteBox({
        id: 'callable-process',
        label: translate('Called Process'),
        model: 'calledElement',
        loadItems: (async () => (await api.getDeployedProcesses())
          .map(process => { return { id: process.procDefKey, name: process.procName }; })
          .filter((process, index, self) => self.indexOf(process) === index))(),
        set: (element, value) => {
          if (!value) {
            return [
              cmdHelper.updateBusinessObject(element, bo, {
                'calledElement': undefined,
                'camunda:calledElementBinding': undefined,
                'camunda:calledElementVersion': undefined,
                'IT-Enterprise:definitionMode': undefined,
                'IT-Enterprise:versionDefinitionMode': undefined
              }),
              ...deleteBusinessKey(element)
            ];
          }
          return [
            cmdHelper.updateBusinessObject(element, bo, {
              'calledElement': value
            }),
            ...setBusinessKey(element, '#{execution.processBusinessKey}', bpmnFactory)
          ];
        },
        validate: required,
        appendIcon: 'mdi-magnify',
        append: () => {
          eventBus.$emit(events.propertiesPanel.selectDeployedProcess, bo.calledElement, (procDefKey) => {
            const cmd = concatCommands([
              cmdHelper.updateBusinessObject(element, bo, { 'calledElement': procDefKey }),
              ...setBusinessKey(element, '#{execution.processBusinessKey}', bpmnFactory)
            ]);
            commandStack.execute(cmd.cmd, cmd.context);
          });
        }
      }));
    }
    
  } else if (typeof bo.get('camunda:caseRef') === 'string') {

    if (bo.get('IT-Enterprise:definitionMode') === 'variable') {
      group.entries.push(entryFactory.textField({
        id: 'callable-case',
        label: translate('Variable'),
        model: 'camunda:caseRef',
        get: () => {
          let value = bo.get('camunda:caseRef');
          if (typeof value === 'string') {
            if (value.startsWith('${')) {
              value = value.substring(2);
            }
            if (value.endsWith('}')) {
              value = value.substring(0, value.length - 1);
            }
          }
          return value;
        },
        set: (element, value) => {
          if (!value) {
            return [
              cmdHelper.updateBusinessObject(element, bo, {
                'camunda:caseRef': undefined,
                'camunda:caseBinding': undefined,
                'camunda:caseVersion': undefined,
                'IT-Enterprise:definitionMode': undefined,
                'IT-Enterprise:versionDefinitionMode': undefined
              }),
              ...deleteBusinessKey(element)
            ];
          }
          return [
            cmdHelper.updateBusinessObject(element, bo, {
              'calledElement': '${' + value + '}'
            }),
            ...setBusinessKey(element, '#{execution.processBusinessKey}', bpmnFactory)
          ];
        },
        validate: required
      }));
    } else if (bo.get('IT-Enterprise:definitionMode') === 'expression') {
      group.entries.push(entryFactory.textArea({
        id: 'callable-case',
        label: translate('Expression'),
        model: 'camunda:caseRef',
        set: (element, value) => {
          if (!value) {
            return [
              cmdHelper.updateBusinessObject(element, bo, {
                'camunda:caseRef': undefined,
                'camunda:caseBinding': undefined,
                'camunda:caseVersion': undefined,
                'IT-Enterprise:definitionMode': undefined,
                'IT-Enterprise:versionDefinitionMode': undefined
              }),
              ...deleteBusinessKey(element)
            ];
          }
          return [
            cmdHelper.updateBusinessObject(element, bo, {
              'camunda:caseRef': value
            }),
            ...setBusinessKey(element, '#{execution.processBusinessKey}', bpmnFactory)
          ];
        },
        validate: required
      }));
    } else {
      group.entries.push(entryFactory.autocompleteBox({
        id: 'callable-case',
        label: translate('Called Case'),
        model: 'camunda:caseRef',
        loadItems: (async () => (await api.getDeployedCases())
          .map(element => { return { id: element.caseDefKey, name: element.caseName }; })
          .filter((element, index, self) => self.indexOf(element) === index))(),
        set: (element, value) => {
          if (!value) {
            return [
              cmdHelper.updateBusinessObject(element, bo, {
                'camunda:caseRef': undefined,
                'camunda:caseBinding': undefined,
                'camunda:caseVersion': undefined,
                'IT-Enterprise:definitionMode': undefined,
                'IT-Enterprise:versionDefinitionMode': undefined
              }),
              ...deleteBusinessKey(element)
            ];
          }
          return [
            cmdHelper.updateBusinessObject(element, bo, {
              'camunda:caseRef': value
            }),
            ...setBusinessKey(element, '#{execution.processBusinessKey}', bpmnFactory)
          ];
        },
        validate: required,
        appendIcon: 'mdi-magnify',
        append: () => {
          eventBus.$emit(events.propertiesPanel.selectDeployedCase, bo['camunda:caseRef'], (caseDefKey) => {
            const cmd = concatCommands([
              cmdHelper.updateBusinessObject(element, bo, { 'camunda:caseRef': caseDefKey }),
              ...setBusinessKey(element, '#{execution.processBusinessKey}', bpmnFactory)
            ]);
            commandStack.execute(cmd.cmd, cmd.context);
          });
        }
      }));
    }
  }

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

      group.entries.push(entryFactory.selectBox({
        id: 'version-definition-mode',
        label: translate('Version Definition Mode'),
        model: 'IT-Enterprise:versionDefinitionMode',
        items: [
          { name: translate('Version'), value: 'identifier' },
          { name: translate('Variable'), value: 'variable' },
          { name: translate('Expression'), value: 'expression' }
        ],
        get: () => {
          const value = bo.get('IT-Enterprise:versionDefinitionMode');
          if (typeof value !== 'string' || value.trim() == '') {
            return 'identifier';
          }
          return value;
        }
      }));

      if (bo.get('IT-Enterprise:versionDefinitionMode') === 'variable') {
        group.entries.push(entryFactory.textField({
          id: 'version',
          label: translate('Variable'),
          model: 'camunda:calledElementVersion',
          get: () => {
            let value = bo.get('camunda:calledElementVersion');
            if (typeof value === 'string') {
              if (value.startsWith('${')) {
                value = value.substring(2);
              }
              if (value.endsWith('}')) {
                value = value.substring(0, value.length - 1);
              }
            }
            return value;
          },
          set: (element, value) => {
            if (!value) {
              return cmdHelper.updateBusinessObject(element, bo, {
                'camunda:calledElementVersion': undefined
              });
            }
            return cmdHelper.updateBusinessObject(element, bo, {
              'camunda:calledElementVersion': '${' + value + '}'
            });
          },
          validate: required
        }));
      } else if (bo.get('IT-Enterprise:versionDefinitionMode') === 'expression') {
        group.entries.push(entryFactory.textArea({
          id: 'version',
          label: translate('Expression'),
          model: 'camunda:calledElementVersion',
          set: (element, value) => {
            if (!value) {
              return cmdHelper.updateBusinessObject(element, bo, {
                'camunda:calledElementVersion': undefined
              });
            }
            return cmdHelper.updateBusinessObject(element, bo, {
              'camunda:calledElementVersion': value
            });
          },
          validate: required
        }));
      } else {
        group.entries.push(entryFactory.autocompleteBox({
          id: 'version',
          label: translate('Version'),
          model: 'camunda:calledElementVersion',
          loadItems: (async () => (await api.getDeployedProcesses())
            .filter(process => process.procDefKey === bo.calledElement)
            .map(process => { return { id: process.procDefVer.toString(), name: process.procDefVer }; }))(),
          set: (element, value) => {
            if (!value) {
              return cmdHelper.updateBusinessObject(element, bo, { 'camunda:calledElementVersion': undefined });
            }
            return cmdHelper.updateBusinessObject(element, bo, { 'camunda:calledElementVersion': value });
          },
          validate: required
        }));
      }
    }
  } else if (typeof bo.get('camunda:caseRef') === 'string' && bo.get('camunda:caseRef') !== '') {
    group.entries.push(entryFactory.selectBox({
      id: 'caseBinding',
      label: translate('Binding'),
      model: 'camunda:caseBinding',
      items: [{ value: 'latest', name: translate('Latest') }, { value: 'version', name: translate('Version') }],
      get: () => {
        const value = bo.get('camunda:caseBinding');
        if (value === 'version') {
          return value;
        }
        return 'latest';
      },
      set: (element, value) => {
        if (value === 'version') {
          return cmdHelper.updateBusinessObject(element, bo, { 'camunda:caseBinding': value, 'camunda:caseVersion': undefined });
        }
        return cmdHelper.updateBusinessObject(element, bo, { 'camunda:caseBinding': undefined, 'camunda:caseVersion': undefined });
      },
      validate: required
    }));

    const binding = bo.get('camunda:caseBinding');
    if (binding === 'version') {

      group.entries.push(entryFactory.selectBox({
        id: 'version-definition-model',
        label: translate('Version Definition Mode'),
        model: 'IT-Enterprise:versionDefinitionMode',
        items: [
          { name: translate('Version'), value: 'identifier' },
          { name: translate('Variable'), value: 'variable' },
          { name: translate('Expression'), value: 'expression' }
        ],
        get: () => {
          const value = bo.get('IT-Enterprise:versionDefinitionMode');
          if (typeof value !== 'string' || value.trim() == '') {
            return 'identifier';
          }
          return value;
        }
      }));

      if (bo.get('IT-Enterprise:versionDefinitionMode') === 'variable') {
        group.entries.push(entryFactory.textField({
          id: 'version',
          label: translate('Variable'),
          model: 'camunda:caseVersion',
          get: () => {
            let value = bo.get('camunda:caseVersion');
            if (typeof value === 'string') {
              if (value.startsWith('${')) {
                value = value.substring(2);
              }
              if (value.endsWith('}')) {
                value = value.substring(0, value.length - 1);
              }
            }
            return value;
          },
          set: (element, value) => {
            if (!value) {
              return cmdHelper.updateBusinessObject(element, bo, {
                'camunda:caseVersion': undefined
              });
            }
            return cmdHelper.updateBusinessObject(element, bo, {
              'camunda:caseVersion': '${' + value + '}'
            });
          },
          validate: required
        }));
      } else if (bo.get('IT-Enterprise:versionDefinitionMode') === 'expression') {
        group.entries.push(entryFactory.textArea({
          id: 'version',
          label: translate('Expression'),
          model: 'camunda:caseVersion',
          set: (element, value) => {
            if (!value) {
              return cmdHelper.updateBusinessObject(element, bo, {
                'camunda:caseVersion': undefined
              });
            }
            return cmdHelper.updateBusinessObject(element, bo, {
              'camunda:caseVersion': value
            });
          },
          validate: required
        }));
      } else {
        group.entries.push(entryFactory.autocompleteBox({
          id: 'version',
          label: translate('Version'),
          model: 'camunda:caseVersion',
          loadItems: (async () => (await api.getDeployedCases())
            .filter(element => element.caseDefKey === bo['camunda:caseRef'])
            .map(element => { return { id: element.caseDefVer.toString(), name: element.caseDefVer }; }))(),
          set: (element, value) => {
            if (!value) {
              return cmdHelper.updateBusinessObject(element, bo, { 'camunda:caseVersion': undefined });
            }
            return cmdHelper.updateBusinessObject(element, bo, { 'camunda:caseVersion': value });
          },
          validate: required
        }));
      }
    }
  }
}

const DEFAULT_PROPS = {
  calledElement: undefined,
  'camunda:calledElementBinding': 'latest',
  'camunda:calledElementVersion': undefined,
  'camunda:calledElementTenantId': undefined,
  'camunda:variableMappingClass': undefined,
  'camunda:variableMappingDelegateExpression': undefined,
  'camunda:caseRef': undefined,
  'camunda:caseBinding': 'latest',
  'camunda:caseVersion': undefined,
  'camunda:caseTenantId': undefined,
  'IT-Enterprise:definitionMode': undefined,
  'IT-Enterprise:versionDefinitionMode': undefined
};

function getCallableType(element) {
  var bo = getBusinessObject(element);

  var boCalledElement = bo.get('calledElement'),
    boCaseRef = bo.get('camunda:caseRef');

  var callActivityType = '';
  if (typeof boCalledElement !== 'undefined') {
    callActivityType = 'bpmn';
  } else

  if (typeof boCaseRef !== 'undefined') {
    callActivityType = 'cmmn';
  }

  return callActivityType;
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
      { 'variables': 'all' },
      extensionElements,
      bpmnFactory
    );

    var allOut = elementHelper.createElement(
      'camunda:Out',
      { 'variables': 'all' },
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