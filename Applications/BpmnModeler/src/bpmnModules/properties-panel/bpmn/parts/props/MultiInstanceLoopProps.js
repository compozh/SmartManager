import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import * as cmdHelper from '../../helpers/CmdHelper';
import elementHelper from '../../helpers/ElementHelper';

export default function addMultiInstanceLoopProps(group, element, entryFactory, bpmnFactory, translate) {
  if (!ensureMultiInstanceSupported(element)) {
    return;
  }

  // loop cardinality //////////////////////////////////////////////////////////////

  group.entries.push(entryFactory.textField({
    id: 'multiInstance-loopCardinality',
    label: translate('Loop Cardinality'),
    model: 'loopCardinality',
    get: (element) => getLoopCardinalityValue(element),
    set: function (element, value) {
      return updateFormalExpression(element, 'loopCardinality', value, bpmnFactory);
    }
  }));


  // collection //////////////////////////////////////////////////////////////////

  group.entries.push(entryFactory.textField({
    id: 'multiInstance-collection',
    label: translate('Collection'),
    model: 'collection',
    get: (element) => getCollection(element),
    set: function (element, value) {
      var loopCharacteristics = getLoopCharacteristics(element);
      return cmdHelper.updateBusinessObject(element, loopCharacteristics, {
        'camunda:collection': value || undefined
      });
    },
    // validate: function (element, values, node) {
    //   var collection = getCollection(element);
    //   var elementVariable = getElementVariable(element);

    //   if (!collection && elementVariable) {
    //     return { collection: 'Must provide a value' };
    //   }
    // }
  }));


  // element variable ////////////////////////////////////////////////////////////

  group.entries.push(entryFactory.textField({
    id: 'multiInstance-elementVariable',
    label: translate('Element Variable'),
    model: 'elementVariable',
    get: (element) => getElementVariable(element),
    set: function (element, value) {
      var loopCharacteristics = getLoopCharacteristics(element);
      return cmdHelper.updateBusinessObject(element, loopCharacteristics, {
        'camunda:elementVariable': value || undefined
      });
    }
  }));


  // Completion Condition //////////////////////////////////////////////////////

  group.entries.push(entryFactory.textField({
    id: 'multiInstance-completionCondition',
    label: translate('Completion Condition'),
    modelProperty: 'completionCondition',
    get: (element) => getCompletionConditionValue(element),
    set: function (element, value) {
      return updateFormalExpression(element, 'completionCondition', value, bpmnFactory);
    }
  }));
}

function ensureMultiInstanceSupported(element) {
  var loopCharacteristics = getLoopCharacteristics(element);
  return !!loopCharacteristics && is(loopCharacteristics, 'camunda:Collectable');
}

/**
 * Get the loop characteristics of an element.
 *
 * @param {djs.model.Base} element
 *
 * @return {ModdleElement<bpmn:MultiInstanceLoopCharacteristics>} the loop characteristics
 */
function getLoopCharacteristics(element) {
  var bo = getBusinessObject(element);
  return bo.loopCharacteristics;
}


/**
 * Get a property value of the loop characteristics.
 *
 * @param {djs.model.Base} element
 * @param {string} propertyName
 *
 * @return {any} the property value
 */
function getProperty(element, propertyName) {
  var loopCharacteristics = getLoopCharacteristics(element);
  return loopCharacteristics && loopCharacteristics.get(propertyName);
}

/**
 * Get the body of a given expression.
 *
 * @param {ModdleElement<bpmn:FormalExpression>} expression
 *
 * @return {string} the body (value) of the expression
 */
function getBody(expression) {
  return expression && expression.get('body');
}


/**
 * Get the loop cardinality of the loop characteristics.
 *
 * @param {djs.model.Base} element
 *
 * @return {ModdleElement<bpmn:FormalExpression>} an expression representing the loop cardinality
 */
function getLoopCardinality(element) {
  return getProperty(element, 'loopCardinality');
}

/**
 * Get the loop cardinality value of the loop characteristics.
 *
 * @param {djs.model.Base} element
 *
 * @return {string} the loop cardinality value
 */
function getLoopCardinalityValue(element) {
  var loopCardinality = getLoopCardinality(element);
  return getBody(loopCardinality);
}

/**
 * Get the completion condition of the loop characteristics.
 *
 * @param {djs.model.Base} element
 *
 * @return {ModdleElement<bpmn:FormalExpression>} an expression representing the completion condition
 */
function getCompletionCondition(element) {
  return getProperty(element, 'completionCondition');
}

/**
 * Get the completion condition value of the loop characteristics.
 *
 * @param {djs.model.Base} element
 *
 * @return {string} the completion condition value
 */
function getCompletionConditionValue(element) {
  var completionCondition = getCompletionCondition(element);
  return getBody(completionCondition);
}

/**
 * Get the 'camunda:collection' attribute value of the loop characteristics.
 *
 * @param {djs.model.Base} element
 *
 * @return {string} the 'camunda:collection' value
 */
function getCollection(element) {
  return getProperty(element, 'camunda:collection');
}

/**
 * Get the 'camunda:elementVariable' attribute value of the loop characteristics.
 *
 * @param {djs.model.Base} element
 *
 * @return {string} the 'camunda:elementVariable' value
 */
function getElementVariable(element) {
  return getProperty(element, 'camunda:elementVariable');
}


/**
 * Creates 'bpmn:FormalExpression' element.
 *
 * @param {ModdleElement} parent
 * @param {string} body
 * @param {BpmnFactory} bpmnFactory
 *
 * @result {ModdleElement<bpmn:FormalExpression>} a formal expression
 */
function createFormalExpression(parent, body, bpmnFactory) {
  return elementHelper.createElement('bpmn:FormalExpression', { body: body }, parent, bpmnFactory);
}

/**
 * Updates a specific formal expression of the loop characteristics.
 *
 * @param {djs.model.Base} element
 * @param {string} propertyName
 * @param {string} newValue
 * @param {BpmnFactory} bpmnFactory
 */
function updateFormalExpression(element, propertyName, newValue, bpmnFactory) {
  var loopCharacteristics = getLoopCharacteristics(element);

  var expressionProps = {};

  if (!newValue) {
    // remove formal expression
    expressionProps[propertyName] = undefined;
    return cmdHelper.updateBusinessObject(element, loopCharacteristics, expressionProps);
  }

  var existingExpression = loopCharacteristics.get(propertyName);

  if (!existingExpression) {
    // add formal expression
    expressionProps[propertyName] = createFormalExpression(loopCharacteristics, newValue, bpmnFactory);
    return cmdHelper.updateBusinessObject(element, loopCharacteristics, expressionProps);
  }

  // edit existing formal expression
  return cmdHelper.updateBusinessObject(element, existingExpression, {
    body: newValue
  });
}
