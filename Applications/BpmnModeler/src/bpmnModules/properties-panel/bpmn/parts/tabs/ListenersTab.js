import { PropertiesPanelTab } from '../../../Models';
import { ListenersGroup } from '../groups';

export default class ListenersTab extends PropertiesPanelTab {
  constructor(diagram, element, entryFactory, bpmnFactory, commandStack, elementRegistry, translate) {

    const groups = [];

    groups.push(new ListenersGroup(diagram, element, entryFactory, bpmnFactory, commandStack, elementRegistry, translate));

    super('listeners', translate('Listeners'), groups.filter(group => group.entries.length > 0));
  }
}
