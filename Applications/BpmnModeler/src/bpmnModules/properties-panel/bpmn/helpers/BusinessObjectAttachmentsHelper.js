import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { getExtensionElements } from './ExtensionElementsHelper';

export function getAttachmentsData(element) {
  const bo = getBusinessObject(element);

  const accessData = getExtensionElements(bo, 'IT-Enterprise:BusinessObjectAttachmentsData');

  if (typeof accessData !== 'undefined') {
    return accessData[0];
  }
}

export function getAttachments(element) {
  const data = getAttachmentsData(element);

  if (typeof data === 'undefined') {
    return [];
  }

  return data.attachments || [];
}

export function getAttachmentsByIndex(element, idx) {
  const attachments = getAttachments(element);
  return attachments[idx];
}

export function getAttachmentsById(element, id) {
  return getAttachments(element).find(rule => rule.id === id);
}
