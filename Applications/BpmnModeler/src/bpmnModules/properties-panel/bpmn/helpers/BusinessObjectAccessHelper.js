import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { getExtensionElements } from './ExtensionElementsHelper';

export function getAccessData(element) {
  const bo = getBusinessObject(element);

  const accessData = getExtensionElements(bo, 'IT-Enterprise:BusinessObjectAccessData');

  if (typeof accessData !== 'undefined') {
    return accessData[0];
  }
}

export function getAccessRules(element) {
  const data = getAccessData(element);

  if (typeof data === 'undefined') {
    return [];
  }

  return data.rules || [];
}

export function getAccessRule(element, idx) {
  const rules = getAccessRules(element);
  return rules[idx];
}

export function getAccessRuleById(element, id) {
  return getAccessRules(element).find(rule => rule.id === id);
}

export function getAccessRuleParameters(accessRule) {
  if (accessRule && accessRule.parameters) {
    return accessRule.parameters;
  }
  return [];
}

