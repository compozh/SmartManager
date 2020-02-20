import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import * as cmdHelper from '../../helpers/CmdHelper';
import { PropertiesPanelGroup } from '../../../Models';
import EntryFactory from '../../../EntryFactory';
import { api } from '../../../../../api/bpmnApi';
import { eventBus } from '../../../../../main';
import { events } from '../../../../../constants';
import { Diagram } from '../../../../../api/models';

/**
 * 
 * @param {PropertiesPanelGroup} group 
 * @param {Diagram} diagram
 * @param {Object} element 
 * @param {EntryFactory} entryFactory 
 * @param {Object} elementRegistry
 * @param {Function} translate 
 */
export default function addDataObjectReferenceProps(group, diagram, element, entryFactory, commandStack, translate) {

  if (!is(element, 'bpmn:DataObjectReference')) {
    return;
  }

  const businessObject = getBusinessObject(element);
  const reference = businessObject.get('dataObjectRef');

  if (!reference) {
    return;
  }

  group.entries.push(entryFactory.autocompleteBox({
    id: 'boReference',
    label: translate('Business Object'),
    model: 'IT-Enterprise:businessObjectDefinitionCode',
    loadItems: (async () => (await api.getBusinessObjects(diagram.isSystem)).map(e => ({ id: e.boDefCode, name: e.name })))(),
    get: () => reference.get('IT-Enterprise:businessObjectDefinitionCode'),
    set: (element, value) => cmdHelper.updateBusinessObject(element, reference, { 'IT-Enterprise:businessObjectDefinitionCode': value }),
    appendIcon: 'mdi-magnify',
    append: () => {
      eventBus.$emit(events.propertiesPanel.selectBusinessObject, reference.get('IT-Enterprise:businessObjectDefinitionCode'), diagram.isSystem, (newValue) => {
        var cmd = cmdHelper.updateBusinessObject(element, reference, { 'IT-Enterprise:businessObjectDefinitionCode': newValue });
        commandStack.execute(cmd.cmd, cmd.context);
      });
    }
  }));

  const boDefCode = reference.get('IT-Enterprise:businessObjectDefinitionCode');

  if (typeof boDefCode === 'string' && boDefCode.trim() !== '') {
    const required = (element, value) => { if (typeof value !== 'string' || value.trim() === '') { return translate('Must provide a value'); } return true; };
    group.entries.push(entryFactory.textField({
      id: 'boKeyVar',
      label: translate('Business Object Key Variable Name'),
      model: 'IT:Enterprise:businessObjectKeyVariableName',
      get: () => reference.get('IT-Enterprise:businessObjectKeyVariableName'),
      set: (element, value) => cmdHelper.updateBusinessObject(element, reference, { 'IT-Enterprise:businessObjectKeyVariableName': value }),
      validate: required
    }));
  }
}