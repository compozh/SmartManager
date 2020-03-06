import { PropertiesPanelEntry } from '../../../Models';
import EntryFactory from '../../../EntryFactory';
import * as cmdHelper from '../../helpers/CmdHelper';

export default class ElementReferencePropertyEntry extends PropertiesPanelEntry {
/**
 * Create an entry to modify a property of an element which
 * is referenced by a event definition.
 *
 * @param  {djs.model.Base} element
 * @param  {ModdleElement} definition
 * @param  {EntryFactory} entryFactory
 * @param  {Object} options
 * @param  {string} options.id the id of the entry
 * @param  {string} options.label the label of the entry
 * @param  {string} options.referenceProperty the name of referencing property
 * @param  {string} options.modelProperty the name of property to modify
 */
  constructor(element, definition, entryFactory, options) {
    const textField = entryFactory.textField({
      id: options.id || 'element-property',
      label: options.label,
      modelProperty: options.modelProperty,
      get: () => {
        const reference = definition.get(options.referenceProperty);
        return reference && reference.get(options.modelProperty);
      },
      set: (element, value) => {
        var reference = definition.get(options.referenceProperty);
        return cmdHelper.updateBusinessObject(element, reference, { [options.modelProperty]: value });
      }
    });
    super(textField.type, textField.data);
  }
}