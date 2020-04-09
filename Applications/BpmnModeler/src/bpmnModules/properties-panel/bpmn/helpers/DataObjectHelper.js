import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { getRoot } from '../../utils';

export function getSelectedBusinessObjects(elementRegistry) {
  return elementRegistry
    .filter((e) => {
      if (!is(e, 'bpmn:DataObjectReference')) {
        return false;
      }
      const bo = getBusinessObject(e);
      const reference = bo.get('dataObjectRef');
      if (!reference) {
        return false;
      }
      const boDefCode = reference.get('IT-Enterprise:businessObjectDefinitionCode');
      return typeof boDefCode === 'string' && boDefCode.trim() != '';
    }).map(e => {
      const bo = getBusinessObject(e);
      const reference = bo.get('dataObjectRef');
      return {
        value: reference.id,
        name: bo.get('name')
      };
    });
}


export function findDataObject(businessObject, dataObjectId) {
  const root = getRoot(businessObject);

  for (let i = 0; i < root.rootElements.length; i++) {
    const rootElement = root.rootElements[i];
    if (Array.isArray(rootElement.flowElements)) {
      for (let j = 0; j < rootElement.flowElements.length; j++) {
        const element = rootElement.flowElements[j];
        if (element.id === dataObjectId) {
          return element;
        }
      }
    }
  }
}