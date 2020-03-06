import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';
import eventDefinitionHelper from '../../helpers/EventDefinitionHelper';
import elementHelper from '../../helpers/ElementHelper';
import * as cmdHelper from '../../helpers/CmdHelper';
import { PropertiesPanelGroup } from '../../../Models';
import EntryFactory from '../../../EntryFactory';

/**
 * 
 * @param {PropertiesPanelGroup} group 
 * @param {Object} element 
 * @param {EntryFactory} entryFactory 
 * @param {Object} bpmnFactory
 * @param {Function} translate 
 */
export default function addConditionalProps(group, element, entryFactory, bpmnFactory, translate) {
  var bo = getBusinessObject(element);

  if (!bo) {
    return;
  }

  var conditionalEventDefinition = eventDefinitionHelper.getConditionalEventDefinition(element);

  if (!(is(element, 'bpmn:SequenceFlow') && isConditionalSource(element.source)) && !conditionalEventDefinition) {
    return;
  }

  group.entries.push(entryFactory.selectBox({
    id: 'condition',
    label: translate('Condition'),
    items: [{ name: translate('Script'), value: 'script' }, { name: translate('Expression'), value: 'expression' }],
    get: () => getConditionType(conditionalEventDefinition, bo),
    set: (element, value) => {
      const conditionType = value,
        commands = [];

      let conditionOrConditionExpression;      
      
      if (conditionType) {
        const condition = { body: '' };
        if (conditionType === 'script') {
          condition.language = '';
        }

        conditionOrConditionExpression = elementHelper.createElement(
          'bpmn:FormalExpression',
          condition,
          conditionalEventDefinition || bo,
          bpmnFactory
        );

        const source = element.source;
        // if default-flow, remove default-property from source
        if (source && source.businessObject.default === bo) {
          commands.push(cmdHelper.updateProperties(source, { 'default': undefined }));
        }
      }

      const update = conditionalEventDefinition
        ? { condition: conditionOrConditionExpression }
        : { conditionExpression: conditionOrConditionExpression };

      commands.push(cmdHelper.updateBusinessObject(element, conditionalEventDefinition || bo, update));

      return commands;
    }
  }));

  const validate = (element, value) => { if (typeof value !== 'string' || value === '') { return translate('Must provide a value'); } return true; };

  const conditionType = getConditionType(conditionalEventDefinition, bo);
  if (conditionType === 'expression') {
    group.entries.push(entryFactory.textArea({
      id: 'expression',
      label: translate('Expression'),
      get: () => getCondition(conditionalEventDefinition, bo).get('body'),
      set: (element, value) => {
        const condition = getCondition(conditionalEventDefinition, bo);
        condition.set('body', value);
        return updateCondition(element, conditionalEventDefinition, bo, bpmnFactory, condition);
      },
      validate
    }));
  } else if (conditionType === 'script') {
    group.entries.push(entryFactory.textField({
      id: 'script-language',
      label: translate('Script Format'),
      get: () => getCondition(conditionalEventDefinition, bo).get('language'),
      set: (element, value) => {
        const condition = getCondition(conditionalEventDefinition, bo);
        condition.language = value;
        return updateCondition(element, conditionalEventDefinition, bo, bpmnFactory, condition);
      },
      validate
    }));
    group.entries.push(entryFactory.selectBox({
      id: 'script-type',
      label: translate('Script Type'),
      items: [{ value: 'inline', name: translate('Inline Script') }, { value: 'external', name: translate('External Resource') }],
      get: () => getScriptType(conditionalEventDefinition, bo),
      set: (element, value) => {
        const condition = getCondition(conditionalEventDefinition, bo);
        if (value === 'inline') {
          condition.set('camunda:resource', undefined);
        } else if (value === 'external') {
          condition.set('camunda:resource', '');
        }
        condition.set('body', '');
        return updateCondition(element, conditionalEventDefinition, bo, bpmnFactory, condition);
      },
      validate
    }));
    const scriptType = getScriptType(conditionalEventDefinition, bo);
    if (scriptType === 'inline') {
      group.entries.push(entryFactory.textArea({
        id: 'script-inline',
        label: translate('Script'),
        get: () => getCondition(conditionalEventDefinition, bo).get('body'),
        set: (element, value) => {
          const condition = getCondition(conditionalEventDefinition, bo);
          condition.set('body', value);
          return updateCondition(element, conditionalEventDefinition, bo, bpmnFactory, condition);
        },
        rows: 3,
        validate
      }));
    } else if (scriptType === 'external') {
      group.entries.push(entryFactory.textArea({
        id: 'script-external',
        label: translate('Resource'),
        get: () => getCondition(conditionalEventDefinition, bo).get('camunda:resource'),
        set: (element, value) => {
          const condition = getCondition(conditionalEventDefinition, bo);
          condition.set('camunda:resource', value);
          return updateCondition(element, conditionalEventDefinition, bo, bpmnFactory, condition);
        },
        validate
      }));
    }
  }
}

var CONDITIONAL_SOURCES = [
  'bpmn:Activity',
  'bpmn:ExclusiveGateway',
  'bpmn:InclusiveGateway',
  'bpmn:ComplexGateway'
];

function isConditionalSource(element) {
  return isAny(element, CONDITIONAL_SOURCES);
}

function getConditionType(conditionalEventDefinition, bo) {
  const conditionExpression = conditionalEventDefinition
    ? conditionalEventDefinition.condition
    : bo.conditionExpression;

  if (conditionExpression) {
    var conditionLanguage = conditionExpression.language;
    if (typeof conditionLanguage !== 'undefined') {
      return 'script';
    } else {
      return 'expression';
    }
  }
}

function getCondition(conditionalEventDefinition, bo) {
  return conditionalEventDefinition
    ? conditionalEventDefinition.condition
    : bo.conditionExpression;
}

function updateCondition(element, conditionalEventDefinition, bo, bpmnFactory, props) {
  const conditionOrConditionExpression = elementHelper.createElement(
    'bpmn:FormalExpression',
    {
      language: props.language,
      body: props.body,
      'camunda:resource': props.get('camunda:resource')
    },
    conditionalEventDefinition || bo,
    bpmnFactory
  );
  const update = conditionalEventDefinition
    ? { condition: conditionOrConditionExpression }
    : { conditionExpression: conditionOrConditionExpression };

  return cmdHelper.updateBusinessObject(element, conditionalEventDefinition || bo, update);
}

function getScriptType(conditionalEventDefinition, bo) {
  return typeof getCondition(conditionalEventDefinition, bo).get('camunda:resource') !== 'undefined' ? 'external' : 'inline';
}