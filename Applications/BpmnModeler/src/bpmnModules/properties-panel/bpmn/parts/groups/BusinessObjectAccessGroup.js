import { PropertiesPanelGroup } from '../../../Models';
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import * as accessHelper from '../../helpers/BusinessObjectAccessHelper';
import elementHelper from '../../helpers/ElementHelper';
import * as cmdHelper from '../../helpers/CmdHelper';
import EntryFactory from '../../../EntryFactory';
import { getSelectedBusinessObjects, findDataObject } from '../../helpers/DataObjectHelper';
import { api } from '../../../../../api/bpmnApi';
import { eventBus } from '../../../../../main';
import { events } from '../../../../../constants';
import { setBusinessObjectAccessParameters } from '../../../utils';
import { removeEntry } from '../../helpers/ExtensionElementsHelper';

let aRule;

export default class BusinessObjectAccessGroup extends PropertiesPanelGroup {
/**
 *
 * @param {Object} element
 * @param {EntryFactory} entryFactory
 * @param {object} bpmnFactory
 * @param {Function} translate
 */
  constructor(diagram, element, entryFactory, bpmnFactory, elementRegistry, commandStack, translate) {
    const entries = [];

    if (is(element, 'bpmn:UserTask') && getSelectedBusinessObjects(elementRegistry).length > 0) {
      entries.push(entryFactory.extensionElements({
        id: 'rules',
        label: translate('Rules'),
        prefix: 'Rule',
        getExtensionElements: () => accessHelper.getAccessRules(element),
        createExtensionElement: (extensionElements, id) => {
          const commands = [];
          let accessData = accessHelper.getAccessData(element);

          if (!accessData) {
            accessData = elementHelper.createElement('IT-Enterprise:BusinessObjectAccessData', { rules: [] }, extensionElements, bpmnFactory);
            commands.push(cmdHelper.addAndRemoveElementsFromList(
              element,
              extensionElements,
              'values',
              'extensionElements',
              [accessData],
              []
            ));
          }
          const rule = elementHelper.createElement('IT-Enterprise:BusinessObjectAccessRule', { id }, accessData, bpmnFactory);
          if (typeof accessData.rules !== 'undefined') {
            commands.push(cmdHelper.addElementsTolist(element, accessData, 'rules', [rule]));
          } else {
            commands.push(cmdHelper.updateBusinessObject(element, accessData, {
              rules: [rule]
            }));
          }
          return commands;
        },
        removeExtensionElement: (ruleId) => {
          var accessData = accessHelper.getAccessData(element),
            entry = accessHelper.getAccessRuleById(element, ruleId),
            commands = [];

          if (accessData.rules.length < 2) {
            commands.push(removeEntry(getBusinessObject(element), element, accessData));
          } else {
            commands.push(cmdHelper.removeElementsFromList(element, accessData, 'rules', null, [entry]));
          }
          return commands;
        },
        onActiveElementChanged: (ruleId) => this.activeRule = aRule = accessHelper.getAccessRuleById(element, ruleId)
      }));
    }

    super('business-object-access', translate('Access'), entries);

    this.elementRegistry = elementRegistry;
    this.entryFactory = entryFactory;
    this.bpmnFactory = bpmnFactory;
    this.translate = translate;
    this.commandStack = commandStack;
    this.diagram = diagram;
    this.element = element;
  }

  activeRule = aRule

  get entries() {

    if (!this.activeRule) {
      return this._entries;
    }

    const entries = [];
    const businessObject = getBusinessObject(this.activeRule);
    const selectedBusinessObjects = getSelectedBusinessObjects(this.elementRegistry);

    const entryFactory = this.entryFactory,
      translate = this.translate,
      bpmnFactory = this.bpmnFactory,
      commandStack = this.commandStack,
      diagram = this.diagram,
      element = this.element;

    const dataObjectRef = businessObject.get('IT-Enterprise:dataObjectRef');

    entries.push(entryFactory.selectBox({
      id: 'boDefCode',
      label: translate('Data Object'),
      model: 'IT-Enterprise:dataObjectRef',
      items: selectedBusinessObjects,
      get: () => dataObjectRef ? dataObjectRef.get('id') : undefined,
      set: (element, value) => {
        const dataObject = findDataObject(businessObject, value);
        return cmdHelper.updateBusinessObject(element, businessObject, {
          'IT-Enterprise:dataObjectRef': dataObject,
          'IT-Enterprise:businessObjectAccessDefinitionCode': undefined,
          'parameters': []
        });
      }
    }));

    const boDefCode = dataObjectRef ? dataObjectRef.get('IT-Enterprise:businessObjectDefinitionCode') : undefined;
    if (boDefCode) {
      entries.push(entryFactory.autocompleteBox({
        id: 'boAccDefCode',
        label: translate('Business Object Access'),
        model: 'IT-Enterprise:businessObjectAccessDefinitionCode',
        loadItems: (async () => (await api.getBusinessObjectAccess(boDefCode, diagram.isSystem))
          .map(act => ({ id: `${act.boDefCode}.${act.accessDefCode}`, name: act.name })))(),
        appendIcon: 'mdi-magnify',
        append: () => {
          eventBus.$emit(events.propertiesPanel.selectBusinessObjectAccess,
            boDefCode,
            businessObject.get('IT-Enterprise:businessObjectAccessDefinitionCode'),
            diagram.isSystem,
            (newValue) => {
              var cmd = cmdHelper.updateBusinessObject(element, businessObject, {
                'IT-Enterprise:businessObjectAccessDefinitionCode': newValue,
                'parameters': []
              });
              commandStack.execute(cmd.cmd, cmd.context);
            });
        },
        get: () => businessObject.get('IT-Enterprise:businessObjectAccessDefinitionCode'),
        set: (element, value) => cmdHelper.updateBusinessObject(element, businessObject, {
          'IT-Enterprise:businessObjectAccessDefinitionCode': value,
          'parameters': []
        })
      }));
    }

    const boAccDefCode = businessObject.get('IT-Enterprise:businessObjectAccessDefinitionCode');
    if (typeof boAccDefCode === 'string' && boAccDefCode.trim() != '') {

      entries.push(entryFactory.button({
        id: 'boActDefCodeParams',
        label: translate('Access Parameters'),
        click(element) {
          setBusinessObjectAccessParameters(element, businessObject, boDefCode, boAccDefCode.split('.')[1], bpmnFactory, commandStack);
        },
      }));

    }

    return this._entries.concat(entries);
  }

}