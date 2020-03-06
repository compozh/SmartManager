import { is } from 'bpmn-js/lib/util/ModelUtil';
import eventDefinitionHelper from '../../helpers/EventDefinitionHelper';
import { PropertiesPanelGroup } from '../../../Models';
import EntryFactory from '../../../EntryFactory';
import { EventDefinitionEntry, ElementReferencePropertyEntry } from '../entries';

/**
 * 
 * @param {PropertiesPanelGroup} group 
 * @param {Object} element 
 * @param {EntryFactory} entryFactory 
 * @param {Object} bpmnFactory 
 * @param {Object} elementRegistry 
 * @param {Function} translate 
 */
export default function addEventProps(group, element, entryFactory, bpmnFactory, commandStack, translate) {
  const events = [
    'bpmn:StartEvent',
    'bpmn:EndEvent',
    'bpmn:IntermediateThrowEvent',
    'bpmn:BoundaryEvent',
    'bpmn:IntermediateCatchEvent'
  ];

  events.forEach(event => {
    if (is(element, event)) {

      var messageEventDefinition = eventDefinitionHelper.getMessageEventDefinition(element),
        signalEventDefinition = eventDefinitionHelper.getSignalEventDefinition(element);

      if (messageEventDefinition) {
        message(group, element, entryFactory, bpmnFactory, commandStack, messageEventDefinition, translate);
      }

      if (signalEventDefinition) {
        signal(group, element, entryFactory, bpmnFactory, commandStack, signalEventDefinition, translate);
      }

    }
  });
}

/**
 *
 * @param {PropertiesPanelGroup} group
 * @param {Object} element
 * @param {EntryFactory} entryFactory
 * @param {Object} bpmnFactory
 * @param {Object} messageEventDefinition
 * @param {Function} translate
 */
function message(group, element, entryFactory, bpmnFactory, commandStack, messageEventDefinition, translate) {
  group.entries.push(new EventDefinitionEntry(element, messageEventDefinition, entryFactory, bpmnFactory, commandStack, {
    id: 'message-element',
    label: translate('Message'),
    prefix: 'Message',
    referenceProperty: 'messageRef',
    elementType: 'bpmn:Message'
  }));

  if (!messageEventDefinition.messageRef) {
    return;
  }

  group.entries.push(new ElementReferencePropertyEntry(element, messageEventDefinition, entryFactory, {
    id: 'message-element-name',
    label: translate('Message Name'),
    referenceProperty: 'messageRef',
    modelProperty: 'name',
  }));
}

/**
 *
 * @param {PropertiesPanelGroup} group
 * @param {Object} element
 * @param {EntryFactory} entryFactory
 * @param {Object} bpmnFactory
 * @param {Object} signalEventDefinition
 * @param {Function} translate
 */
function signal(group, element, entryFactory, bpmnFactory, commandStack, signalEventDefinition, translate) {
  group.entries.push(new EventDefinitionEntry(element, signalEventDefinition, entryFactory, bpmnFactory, commandStack, {
    id: 'signal-element',
    label: translate('Signal'),
    prefix: 'Signal',
    referenceProperty: 'signalRef',
    elementType: 'bpmn:Signal'
  }));

  if (!signalEventDefinition.signalRef) {
    return;
  }

  group.entries.push(new ElementReferencePropertyEntry(element, signalEventDefinition, entryFactory, {
    id: 'signal-element-name',
    label: translate('Signal Name'),
    referenceProperty: 'signalRef',
    modelProperty: 'name',
  }));
}