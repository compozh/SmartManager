import { PropertiesPanelEntry } from '../../../Models';
import * as utils from '../../../utils';
import elementHelper from '../../helpers/ElementHelper';
import * as cmdHelper from '../../helpers/CmdHelper';

export default class EventDefinitionEntry extends PropertiesPanelEntry {
  constructor(element, definition, entryFactory, bpmnFactory, commandStack, options) {
    const data = {
      props: {
        key: options.id,
        label: options.label,
        readonly: entryFactory.readonly,
        element: element,
        getExtensionElements: () => {
          return utils.findRootElementsByType(definition, options.elementType).map(obj => {
            return {
              label: (obj.name || '') + ' (id=' + obj.id + ')',
              id: obj.id
            };
          });
        },
        createExtensionElement: () => {
          const root = utils.getRoot(definition);
          const el = elementHelper.createElement(options.elementType, { name: utils.nextId(options.prefix) }, root, bpmnFactory);
          const commands = [
            cmdHelper.addAndRemoveElementsFromList(element, root, 'rootElements', null, [el]),
            cmdHelper.updateBusinessObject(element, definition, { [options.referenceProperty]: el })
          ];
          const cmd = utils.concatCommands(commands);
          commandStack.execute(cmd.cmd, cmd.context);
        },
        removeExtensionElement: (elementId) => {
          const root = utils.getRoot(definition);
          const element = findElementById(definition, options.elementType, elementId);
          const cmd = cmdHelper.removeElementsFromList(element, root, 'rootElements', null, [element]);
          commandStack.execute(cmd.cmd, cmd.context);
        },
        onActiveElementChanged: (elementId) => {
          if (elementId === getSelectedElementId(definition, options.referenceProperty)) {
            return;
          }
          const selectedElement = findElementById(definition, options.elementType, elementId);
          const cmd = cmdHelper.updateBusinessObject(element, definition, { [options.referenceProperty]: selectedElement });
          commandStack.execute(cmd.cmd, cmd.context);
        },
        activeElement: getSelectedElementId(definition, options.referenceProperty)
      }
    };
    super('properties-panel-extension-elements', data);
  }
}

/**
 * Find element by given id.
 *
 * @param {ModdleElement} eventDefinition
 *
 * @return {ModdleElement} an element
 */
function findElementById(eventDefinition, type, id) {
  return utils.findRootElementsByType(eventDefinition, type).find(element => element.id === id);
}

function getSelectedElementId(definition, referenceProperty) {
  const element = definition[referenceProperty];
  if (typeof element === 'object') {
    return element.id;
  }
  return element;
}