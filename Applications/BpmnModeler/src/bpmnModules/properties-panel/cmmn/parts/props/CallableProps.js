import { getBusinessObject, getDefinition } from 'cmmn-js/lib/util/ModelUtil';
import * as cmdHelper from '../../helpers/CmdHelper';
import elementHelper from '../../helpers/ElementHelper';
import extensionElementsHelper from '../../helpers/ExtensionElementsHelper';
import { isCallable } from '../../helpers/CmmnElementHelper';
import EntryFactory from '../../CmmnEntryFactory';
import { concatCommands } from '../../../utils';
import { api } from '../../../../../api/bpmnApi';
import { eventBus } from '../../../../../main';
import { events } from '../../../../../constants';

/**
 * Добавить в группу свойства наименования
 * @param {PropertiesPanelGroup} group - Группа
 * @param {Object} element - Текущий выбранный элемент диаграммы
 * @param {EntryFactory} entryFactory - Фабрика элементов панели свойств
 * @param {Function} translate - Функция перевода
 */
export default function CaseProps(group, element, entryFactory, cmmnFactory, commandStack, translate) {
  if (!isCallable(element)) {
    return;
  }

  function getAttribute(element, prop) {
    var bo = getBusinessObject(element),
      type = bo && bo.$type;
    return (attributeInfo[type] || {})[prop];
  }

  function getCallableBindingValue(element) {
    var definition = getDefinition(element);
    var attr = getAttribute(definition, 'binding');
    return definition && definition.get(attr);
  }

  const getValue = function (modelProp, prop, defaultValue) {
    return function (element, bo) {
      return (bo && bo.get(prop)) || defaultValue;
    };
  };

  const setValue = function (modelProp, prop, defaultValue) {
    return function (element, value, bo) {
      var update = {};
      update[prop] = value || defaultValue;
      return cmdHelper.updateProperties(bo, update, element);
    };
  };

  const validate = function (prop) {
    return function (element, value, bo) {
      if (!value) {
        return translate('Must provide a value');
      }
      return true;
    };
  };

  const getDeployedItems = function (element) {
    const bo = getBusinessObject(element),
      type = bo && bo.$type;
    return deployedRefs[type]();
  };

  const getDeployedItemVersions = function (element) {
    const bo = getBusinessObject(element),
      type = bo && bo.$type;
    const attr = getAttribute(element, 'ref');
    const ref = bo.get(attr);
    return deployedRefVersions[type](ref);
  };

  group.entries.push(entryFactory.autocompleteBox({
    id: 'callableReference',
    label: translate('Reference'),
    reference: 'definitionRef',
    model: getAttribute(getDefinition(element), 'ref'),
    validate: validate('ref'),
    loadItems: getDeployedItems(getDefinition(element)),
    set: (element, value, bo) => {
      const commands = [];
      const definition = getDefinition(element);
      const isDmn = definition.$type === 'cmmn:DecisionTask';

      if (value) {
        commands.push(cmdHelper.updateBusinessObject(definition, bo, {
          [getAttribute(definition, 'ref')]: value,
          [getAttribute(definition, 'expression')]: undefined,
          [getAttribute(definition, 'binding')]: undefined,
          [getAttribute(definition, 'version')]: undefined,
          [getAttribute(definition, 'tenantId')]: undefined
        }));
        if (!isDmn) {
          commands.push(setBusinessKey(definition, '#{caseExecution.caseBusinessKey}', cmmnFactory));
        }
      } else {
        commands.push(cmdHelper.updateBusinessObject(definition, bo, {
          [getAttribute(definition, 'ref')]: undefined,
          [getAttribute(definition, 'expression')]: undefined,
          [getAttribute(definition, 'binding')]: undefined,
          [getAttribute(definition, 'version')]: undefined,
          [getAttribute(definition, 'tenantId')]: undefined
        }));
        if (!isDmn) {
          commands.push(deleteBusinessKey(definition));
        }
      }
      return commands.flat();
    },
    appendIcon: 'mdi-magnify',
    append: () => {
      const definition = getDefinition(element);
      const bo = getBusinessObject(definition);
      eventBus.$emit(getAttribute(definition, 'event'), bo[getAttribute(definition, 'ref')], (refKey) => {
        const cmd = concatCommands([
          cmdHelper.updateBusinessObject(element, bo, { [getAttribute(definition, 'ref')]: refKey }),
          ...setBusinessKey(element, '#{caseExecution.caseBusinessKey}', cmmnFactory)
        ]);
        commandStack.execute(cmd.cmd, cmd.context);
      });
    }
  }));

  group.entries.push(entryFactory.selectBox({
    id: 'callableBinding',
    label: translate('Binding'),
    items: [ { name: translate('Latest'), value: 'latest' }, { name: translate('Version'), value: 'version' } ],
    model: 'callableBinding',
    reference: 'definitionRef',
    get: function (element, bo) {
      var attr = getAttribute(bo, 'binding');
      return (attr && bo.get(attr)) || 'latest';
    },
    set: function (element, value, bo) {
      var binding = value,
        attr = getAttribute(bo, 'binding'),
        attrVer = getAttribute(bo, 'version');

      var props = {};
      props[attr] = binding;
      // set version value always on undefined to delete the existing value
      props[attrVer] = undefined;
      return cmdHelper.updateProperties(bo, props, element);
    }
  }));

  if (getCallableBindingValue(element) === 'version') {
    group.entries.push(entryFactory.autocompleteBox({
      id: 'callable-version',
      label: translate('Version'),
      model: 'callableVersion',
      reference: 'definitionRef',
      get: getValue('callableVersion', getAttribute(getDefinition(element), 'version')),
      set: setValue('callableVersion', getAttribute(getDefinition(element), 'version')),
      validate: function (element, value) {
        const version = value;
        if ((getCallableBindingValue(element) === 'version') && !version) {
          return translate('Must provide a value');
        }
        return true;
      },
      loadItems: getDeployedItemVersions(getDefinition(element))
    }));
  }
}

const attributeInfo = {
  'cmmn:CaseTask': {
    ref: 'caseRef',
    expression: 'caseRefExpression',
    binding: 'camunda:caseBinding',
    version: 'camunda:caseVersion',
    tenantId: 'camunda:caseTenantId',
    event: events.propertiesPanel.selectDeployedCase
  },

  'cmmn:ProcessTask': {
    ref: 'processRef',
    expression: 'processRefExpression',
    binding: 'camunda:processBinding',
    version: 'camunda:processVersion',
    tenantId: 'camunda:processTenantId',
    event: events.propertiesPanel.selectDeployedProcess
  },

  'cmmn:DecisionTask': {
    ref: 'decisionRef',
    expression: 'decisionRefExpression',
    binding: 'camunda:decisionBinding',
    version: 'camunda:decisionVersion',
    tenantId: 'camunda:decisionTenantId',
    event: events.propertiesPanel.selectDeployedDecision
  }
};

const deployedRefs = {
  'cmmn:CaseTask': async () => (await api.getDeployedCases())
    .map(element => { return { id: element.caseDefKey, name: element.caseName }; })
    .filter((element, index, self) => self.indexOf(element) === index),
  'cmmn:ProcessTask': async () => (await api.getDeployedProcesses())
    .map(process => { return { id: process.procDefKey, name: process.procName }; })
    .filter((process, index, self) => self.indexOf(process) === index),
  'cmmn:DecisionTask': async () => (await api.getDeployedDecisions())
    .map(decision => { return { id: decision.decDefKey, name: decision.decDefName }; })
    .filter((decision, index, self) => self.indexOf(decision) === index)
};

const deployedRefVersions = {
  'cmmn:CaseTask': async (caseRef) => (await api.getDeployedCases())
    .filter(element => element.caseDefKey === caseRef)
    .map(element => { return { id: element.caseDefVer.toString(), name: element.caseDefVer }; }),
  'cmmn:ProcessTask': async (procRef) => (await api.getDeployedProcesses())
    .filter(process => process.procDefKey === procRef)
    .map(process => { return { id: process.procDefVer.toString(), name: process.procDefVer }; }),
  'cmmn:DecisionTask': async (decRef) => (await api.getDeployedDecisions())
    .filter(decision => decision.decDefKey === decRef)
    .map(decison => { return { id: decison.decDefVer.toString(), name: decison.decDefVer }; })
};

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

function setBusinessKey(element, text, cmmnFactory) {
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
      extensionElements = elementHelper.createElement('cmmn:ExtensionElements', { values: [] }, bo, cmmnFactory);
      commands.push(cmdHelper.updateProperties(element, { extensionElements: extensionElements }));
    }

    var camundaIn = elementHelper.createElement(
      'camunda:In',
      { 'businessKey': text },
      extensionElements,
      cmmnFactory
    );

    var allIn = elementHelper.createElement(
      'camunda:In',
      { 'variables': 'all' },
      extensionElements,
      cmmnFactory
    );

    var allOut = elementHelper.createElement(
      'camunda:Out',
      { 'variables': 'all' },
      extensionElements,
      cmmnFactory
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