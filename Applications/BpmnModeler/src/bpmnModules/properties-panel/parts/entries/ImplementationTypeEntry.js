import { PropertiesPanelEntry } from '../../Models';
import EntryFactory from '../../EntryFactory';

import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';
import elementHelper from 'bpmn-js-properties-panel/lib/helper/ElementHelper';
import extensionElementsHelper from 'bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper';
import assign from 'lodash/assign';
import map from 'lodash/map';

const DEFAULT_DELEGATE_PROPS = ['class', 'expression', 'delegateExpression'];

const DELEGATE_PROPS = {
  'camunda:class': undefined,
  'camunda:expression': undefined,
  'camunda:delegateExpression': undefined,
  'camunda:resultVariable': undefined
};

const DMN_CAPABLE_PROPS = {
  'camunda:decisionRef': undefined,
  'camunda:decisionRefBinding': 'latest',
  'camunda:decisionRefVersion': undefined,
  'camunda:mapDecisionResult': 'resultList',
  'camunda:decisionRefTenantId': undefined
};


const EXTERNAL_CAPABLE_PROPS = {
  'camunda:type': undefined,
  'camunda:topic': undefined
};

export default class ImplementationTypeEntry extends PropertiesPanelEntry {
  /**
   * Создать описание свойсва "Тип реализации" 
   * @param {EntryFactory} entryFactory - Фабрика элементов панели свойств
   * @param {Object} bpmnFactory - Фабрика bpmn элементов
   * @param {Function} translate - Функция перевода
   * @param {Object} options - Параметры
   */
  constructor(entryFactory, bpmnFactory, translate, options) {

    var getType = options.getImplementationType,
      getBusinessObject = options.getBusinessObject;

    var hasDmnSupport = options.hasDmnSupport,
      hasExternalSupport = options.hasExternalSupport,
      hasScriptSupport = options.hasScriptSupport,
      hasServiceTaskLikeSupport = options.hasServiceTaskLikeSupport;

    var DEFAULT_OPTIONS = [ { value: 'expression', name: translate('Expression') } ];
    var DMN_OPTION = { value: 'dmn', name: translate('DMN') };
    var EXTERNAL_OPTION = { value: 'external', name: translate('Action') };
    var SCRIPT_OPTION = { value: 'script', name: translate('Script') };
    
    var selectOptions = DEFAULT_OPTIONS;

    if (hasDmnSupport) {
      //selectOptions.push(DMN_OPTION);
    }

    if (hasExternalSupport) {
      selectOptions.push(EXTERNAL_OPTION);
    }

    if (hasScriptSupport) {
      //selectOptions.push(SCRIPT_OPTION);
    }

    const comboBox = entryFactory.selectBox({
      id: 'implementation',
      label: translate('Implementation'),
      model: 'implType',
      items: selectOptions,
      get(element) {
        return getType(element) || '';
      },
      set(element, value) {
        var bo = getBusinessObject(element);
        var oldType = getType(element);
        var newType = value;

        var props = assign({}, DELEGATE_PROPS);

        if (DEFAULT_DELEGATE_PROPS.indexOf(newType) !== -1) {

          var newValue = '';
          if (DEFAULT_DELEGATE_PROPS.indexOf(oldType) !== -1) {
            newValue = bo.get('camunda:' + oldType);
          }
          props['camunda:' + newType] = newValue;
        }

        if (hasDmnSupport) {
          props = assign(props, DMN_CAPABLE_PROPS);
          if (newType === 'dmn') {
            props['camunda:decisionRef'] = '';
          }
        }

        if (hasExternalSupport) {
          props = assign(props, EXTERNAL_CAPABLE_PROPS);
          if (newType === 'external') {
            props['camunda:type'] = 'external';
            props['camunda:topic'] = '';
          }
        }

        if (hasScriptSupport) {
          props['camunda:script'] = undefined;

          if (newType === 'script') {
            props['camunda:script'] = elementHelper.createElement('camunda:Script', {}, bo, bpmnFactory);
          }
        }

        var commands = [];
        commands.push(cmdHelper.updateBusinessObject(element, bo, props));

        if (hasServiceTaskLikeSupport) {
          var connectors = extensionElementsHelper.getExtensionElements(bo, 'camunda:Connector');
          commands.push(map(connectors, function (connector) {
            return extensionElementsHelper.removeEntry(bo, element, connector);
          }));

          if (newType === 'connector') {
            var extensionElements = bo.get('extensionElements');
            if (!extensionElements) {
              extensionElements = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory);
              commands.push(cmdHelper.updateBusinessObject(element, bo, { extensionElements: extensionElements }));
            }
            var connector = elementHelper.createElement('camunda:Connector', {}, extensionElements, bpmnFactory);
            commands.push(cmdHelper.addAndRemoveElementsFromList(
              element,
              extensionElements,
              'values',
              'extensionElements',
              [connector],
              []
            ));
          }
        }

        return commands;
      }
    });

    super(comboBox.type, comboBox.data);
  }
}