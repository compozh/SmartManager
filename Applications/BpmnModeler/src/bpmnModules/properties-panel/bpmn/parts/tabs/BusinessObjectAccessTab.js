import { PropertiesPanelTab } from '../../../Models';
import { BusinessObjectAccessGroup } from '../groups';

export default class BusinessObjectAccessTab extends PropertiesPanelTab {
  constructor(diagram, element, entryFactory, commandStack, bpmnFactory, elementRegistry, translate) {
    const groups = [];

    groups.push(new BusinessObjectAccessGroup(diagram,element, entryFactory, bpmnFactory, elementRegistry, commandStack, translate));

    super('business-object-access', translate('Access'), groups.filter(group => group.entries.length > 0));
  }
}