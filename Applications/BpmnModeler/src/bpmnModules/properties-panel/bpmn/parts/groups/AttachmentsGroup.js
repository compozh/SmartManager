import { PropertiesPanelGroup } from '../../../Models';
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import * as attachmentsHelper from '../../helpers/BusinessObjectAttachmentsHelper';
import elementHelper from '../../helpers/ElementHelper';
import * as cmdHelper from '../../helpers/CmdHelper';
import EntryFactory from '../../../EntryFactory';
import { getSelectedBusinessObjects, findDataObject } from '../../helpers/DataObjectHelper';
import { api } from '../../../../../api/bpmnApi';
import { eventBus } from '../../../../../main';
import { events } from '../../../../../constants';
import { setBusinessObjectAccessParameters } from '../../../utils';
import { removeEntry } from '../../helpers/ExtensionElementsHelper';

let attachment;

export default class AttachmentsGroup extends PropertiesPanelGroup {
/**
 *
 * @param {Object} element
 * @param {EntryFactory} entryFactory
 * @param {object} bpmnFactory
 * @param {Function} translate
 */
  constructor(element, entryFactory, bpmnFactory, elementRegistry, translate) {
    const entries = [];
    const businessObjects = getSelectedBusinessObjects(elementRegistry);

    if (is(element, 'bpmn:UserTask') && businessObjects.length > 0) {
      entries.push(entryFactory.extensionElements({
        id: 'attachments',
        label: translate('Attachments'),
        prefix: 'Attachment',
        getExtensionElements: () => attachmentsHelper.getAttachments(element),
        createExtensionElement: (extensionElements, id) => {
          const commands = [];
          let attachmentsData = attachmentsHelper.getAttachmentsData(element);

          if (!attachmentsData) {
            attachmentsData = elementHelper.createElement('IT-Enterprise:BusinessObjectAttachmentsData', { attachments: [] }, extensionElements, bpmnFactory);
            commands.push(cmdHelper.addAndRemoveElementsFromList(
              element,
              extensionElements,
              'values',
              'extensionElements',
              [attachmentsData],
              []
            ));
          }
          const attachments = elementHelper.createElement('IT-Enterprise:BusinessObjectAttachments', { id }, attachmentsData, bpmnFactory);
          if (typeof attachmentsData.attachments !== 'undefined') {
            commands.push(cmdHelper.addElementsTolist(element, attachmentsData, 'attachments', [attachments]));
          } else {
            commands.push(cmdHelper.updateBusinessObject(element, attachmentsData, {
              attachments: [attachments]
            }));
          }
          return commands;
        },
        removeExtensionElement: (ruleId) => {
          var accessData = attachmentsHelper.getAttachmentsData(element),
            entry = attachmentsHelper.getAttachmentsById(element, ruleId),
            commands = [];

          if (accessData.attachments.length < 2) {
            commands.push(removeEntry(getBusinessObject(element), element, accessData));
          } else {
            commands.push(cmdHelper.removeElementsFromList(element, accessData, 'attachments', null, [entry]));
          }
          return commands;
        },
        onActiveElementChanged: (ruleId) => this.activeAttachment = attachment = attachmentsHelper.getAttachmentsById(element, ruleId)
      }));
    }

    super('business-object-access', translate('Attachments'), entries);

    this.elementRegistry = elementRegistry;
    this.entryFactory = entryFactory;
    this.translate = translate;
  }

  activeAttachment = attachment;

  get entries() {

    if (!this.activeAttachment) {
      return this._entries;
    }

    const entries = [];
    const businessObject = getBusinessObject(this.activeAttachment);
    const selectedBusinessObjects = getSelectedBusinessObjects(this.elementRegistry);

    const entryFactory = this.entryFactory,
      translate = this.translate;

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
          'IT-Enterprise:dataObjectRef': dataObject
        });
      }
    }));

    return this._entries.concat(entries);
  }
}