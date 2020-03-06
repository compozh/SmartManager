import { PropertiesPanelEntry } from '../../../Models';
import EntryFactory from '../../../EntryFactory';

import * as cmdHelper from '../../helpers/CmdHelper';
import elementHelper from '../../helpers/ElementHelper';
import * as extensionElementsHelper from '../../helpers/ExtensionElementsHelper';
import assign from 'lodash/assign';
import map from 'lodash/map';

const DEFAULT_DELEGATE_PROPS = ['class', 'expression', 'delegateExpression'];

const BUSINESS_OBJECT_PROPS = ['businessObjectAction', 'businessObjectAccess'];

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

    var hasExternalSupport = options.hasExternalSupport,
      hasServiceTaskLikeSupport = options.hasServiceTaskLikeSupport;

    var DEFAULT_OPTIONS = [ { value: 'expression', name: translate('Expression') } ];
    var EXTERNAL_OPTION = { value: 'external', name: translate('Action') };
    var BUSINESS_OBJECT_OPTIONS = [
      { value: 'businessObjectAction', name: translate('Business Object Action') },
      { value: 'businessObjectAccess', name: translate('Business Object Access') }
    ];
    
    var selectOptions = DEFAULT_OPTIONS;

    if (hasExternalSupport) {
      selectOptions.push(EXTERNAL_OPTION);
    }
    if (options.businessObjectsExists) {
      selectOptions.push(...BUSINESS_OBJECT_OPTIONS);
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

        if (BUSINESS_OBJECT_PROPS.indexOf(oldType) !== -1) {
          props['IT-Enterprise:businessObjectTaskType'] = undefined;
          props['IT-Enterprise:businessObjectDefinitionCode'] = undefined;
          props['camunda:topic'] = undefined;
          props['camunda:type'] = undefined;
        }

        if (DEFAULT_DELEGATE_PROPS.indexOf(newType) !== -1) {

          var newValue = '';
          if (DEFAULT_DELEGATE_PROPS.indexOf(oldType) !== -1) {
            newValue = bo.get('camunda:' + oldType);
          }
          props['camunda:' + newType] = newValue;
        }

        if (hasExternalSupport) {
          props = assign(props, EXTERNAL_CAPABLE_PROPS);
          if (newType === 'external') {
            props['camunda:type'] = 'external';
            props['camunda:topic'] = '';
          }
        }

        if (BUSINESS_OBJECT_PROPS.indexOf(newType) !== -1) {
          props['camunda:type'] = 'external';
          props['IT-Enterprise:businessObjectTaskType'] = newType;
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