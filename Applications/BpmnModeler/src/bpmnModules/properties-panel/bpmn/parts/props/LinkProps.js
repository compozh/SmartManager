import { PropertiesPanelGroup } from '../../../Models';
import EntryFactory from '../../../EntryFactory';
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import * as cmdHelper from '../../helpers/CmdHelper';

/**
 *
 * @param {PropertiesPanelGroup} group
 * @param {Object} element
 * @param {EntryFactory} entryFactory
 * @param {Function} translate
 */
export default function addLinkProps(group, element, entryFactory, translate) {
  if (!(is(element, 'bpmn:IntermediateThrowEvent') || is(element, 'bpmn:IntermediateCatchEvent'))) {
    return;
  }
  const linkEventDefinition = getLinkEventDefinition(element);

  if (!linkEventDefinition) {
    return;
  }

  group.entries.push(entryFactory.textField({
    id: 'link-name',
    label: translate('Link Name'),
    model: 'link-name',
    get: () => linkEventDefinition.get('name'),
    set: (element, value) => cmdHelper.updateBusinessObject(element, linkEventDefinition, { name: value })
  }));
}

function getLinkEventDefinition(element) {
  const bo = getBusinessObject(element);
  return bo.get('eventDefinitions').find(eventDefinition => is(eventDefinition, 'bpmn:LinkEventDefinition'));
}