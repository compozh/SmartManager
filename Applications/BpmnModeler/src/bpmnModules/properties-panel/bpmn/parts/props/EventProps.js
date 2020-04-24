import { is } from 'bpmn-js/lib/util/ModelUtil';
import eventDefinitionHelper from '../../helpers/EventDefinitionHelper';
import { PropertiesPanelGroup } from '../../../Models';
import EntryFactory from '../../../EntryFactory';
import { EventDefinitionEntry, ElementReferencePropertyEntry } from '../entries';
import elementHelper from '../../helpers/ElementHelper';
import * as cmdHelper from '../../helpers/CmdHelper';

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


  // Timer Event Definition
  var timerEvents = [
    'bpmn:StartEvent',
    'bpmn:BoundaryEvent',
    'bpmn:IntermediateCatchEvent'
  ];

  timerEvents.forEach((event) => {
    if (is(element, event)) {

      // get business object
      var timerEventDefinition = eventDefinitionHelper.getTimerEventDefinition(element);

      if (timerEventDefinition) {
        timer(group, element, entryFactory, bpmnFactory, timerEventDefinition, translate);
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

/**
 *
 * @param {PropertiesPanelGroup} group
 * @param {Object} element
 * @param {EntryFactory} entryFactory
 * @param {Object} bpmnFactory
 * @param {Object} timerEventDefinition
 * @param {Function} translate
 */
function timer(group, element, entryFactory, bpmnFactory, timerEventDefinition, translate) {
  var selectOptions = [
    { value: 'timeDate', name: translate('Date') },
    { value: 'timeDuration', name: translate('Duration') },
    { value: 'timeCycle', name: translate('Cycle') }
  ];

  group.entries.push(entryFactory.selectBox({
    id: 'timer-event-definition-type',
    label: translate('Timer Definition Type'),
    model: 'timerDefinitionType',
    items: selectOptions,
    get: (element, node) => {
      const timerDefinition = getTimerDefinition(timerEventDefinition, element, node);
      return getTimerDefinitionType(timerDefinition) || '';
    },

    set: function (element, value) {
      var props = {
        timeDuration: undefined,
        timeDate: undefined,
        timeCycle: undefined
      };


      var timerDefinition = getTimerDefinition(timerEventDefinition, element),
        newType = value;

      if (value) {
        var oldType = getTimerDefinitionType(timerDefinition);

        let body;
        if (oldType) {
          var definition = timerDefinition.get(oldType);
          body = definition.get('body');
        }

        props[newType] = createFormalExpression(timerDefinition, body, bpmnFactory);
      }

      return cmdHelper.updateBusinessObject(element, timerDefinition, props);
    }
  }));

  if (!getTimerDefinitionType(getTimerDefinition(timerEventDefinition, element))) {
    return;
  }

  group.entries.push(entryFactory.textField({
    id: 'timer-event-definition',
    label: translate('Timer Definition'),
    model: 'timerDefinition',

    get: () => {
      var timerDefinition = getTimerDefinition(timerEventDefinition, element),
        type = getTimerDefinitionType(timerDefinition),
        definition = type && timerDefinition.get(type),
        value = definition && definition.get('body');

      return value;
    },

    set: function (element, value) {
      var timerDefinition = getTimerDefinition(timerEventDefinition, element),
        type = getTimerDefinitionType(timerDefinition),
        definition = type && timerDefinition.get(type);

      if (definition) {
        return cmdHelper.updateBusinessObject(element, definition, {
          body: value || undefined
        });
      }
    }
  }));
}

/**
 * Get the timer definition type for a given timer event definition.
 *
 * @param {ModdleElement<bpmn:TimerEventDefinition>} timer
 *
 * @return {string|undefined} the timer definition type
 */
function getTimerDefinitionType(timer) {

  if (!timer) {
    return;
  }

  var timeDate = timer.get('timeDate');
  if (typeof timeDate !== 'undefined') {
    return 'timeDate';
  }

  var timeCycle = timer.get('timeCycle');
  if (typeof timeCycle !== 'undefined') {
    return 'timeCycle';
  }

  var timeDuration = timer.get('timeDuration');
  if (typeof timeDuration !== 'undefined') {
    return 'timeDuration';
  }
}

/**
 * Get the actual timer event definition based on option, whether it's a getter
 * to fetch the timer event definition or the exact event definition itself
 *
 * @param {ModdleElement<bpmn:TimerEventDefinition>|Function} timerOrFunction
 * @param {Shape} element
 * @param {HTMLElement} node
 *
 * @return ModdleElement<bpmn:TimerEventDefinition>
 */
function getTimerDefinition(timerOrFunction, element) {
  if (typeof timerOrFunction === 'function') {
    return timerOrFunction(element);
  }

  return timerOrFunction;
}

/**
 * Creates 'bpmn:FormalExpression' element.
 *
 * @param {ModdleElement} parent
 * @param {string} body
 * @param {BpmnFactory} bpmnFactory
 *
 * @return {ModdleElement<bpmn:FormalExpression>} a formal expression
 */
function createFormalExpression(parent, body, bpmnFactory) {
  body = body || undefined;
  return elementHelper.createElement('bpmn:FormalExpression', { body: body }, parent, bpmnFactory);
}
