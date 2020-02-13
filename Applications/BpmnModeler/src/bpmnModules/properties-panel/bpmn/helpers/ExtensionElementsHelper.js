'use strict';

import { addElementsTolist, removeElementsFromList } from './CmdHelper';
import { createElement } from './ElementHelper';

import { is } from 'bpmn-js/lib/util/ModelUtil';

export function getExtensionElements(bo, type) {
  var extensionElements = bo.get('extensionElements');
  if (typeof extensionElements !== 'undefined') {
    var extensionValues = extensionElements.get('values');
    if (typeof extensionValues !== 'undefined') {
      var elements = extensionValues.filter(function (value) {
        return is(value, type);
      });
      if (elements.length) {
        return elements;
      }
    }
  }
}

export function addEntry(bo, element, entry, bpmnFactory) {
  var extensionElements = bo.get('extensionElements');

  // if there is no extensionElements list, create one
  if (!extensionElements) {
    // TODO: Ask Daniel which operation costs more
    extensionElements = createElement('bpmn:ExtensionElements', { values: [entry] }, bo, bpmnFactory);
    return { extensionElements: extensionElements };
  } else {
    // add new failedJobRetryExtensionElement to existing extensionElements list
    return addElementsTolist(element, extensionElements, 'values', [entry]);
  }
}

export function removeEntry(bo, element, entry) {
  var extensionElements = bo.get('extensionElements');

  if (!extensionElements) {

    // return an empty command when there is no extensionElements list
    return {};
  }

  return removeElementsFromList(element, extensionElements, 'values', 'extensionElements', [entry]);
}
