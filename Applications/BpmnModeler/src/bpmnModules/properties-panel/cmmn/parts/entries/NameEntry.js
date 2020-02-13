import { PropertiesPanelEntry } from '../../../Models';
import EntryFactory from '../../CmmnEntryFactory';

/**
 * Свойство "Название элемента"
 */
export default class NameEntry extends PropertiesPanelEntry {
  /**
   * Создать описание свойства "Название элемента"
   * @param {Object} options - Текущий выбранный элемент диаграммы
   * @param {EntryFactory} entryFactory - Фабрика элементов панели свойств
   * @param {Function} translate - Функция перевода
   */
  constructor(entryFactory, translate, options) {
    const textArea = entryFactory.textArea({
      id: options.id || 'name',
      label: options.label || translate('Name'),
      model: options.model || 'name',
      reference: options.reference,
      get: options.get,
      set: options.set
    });

    super(textArea.type, textArea.data);
  }
}