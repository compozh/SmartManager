import { PropertiesPanelEntry } from '../../../Models';
import EntryFactory from '../../CmmnEntryFactory';
import { getBusinessObject } from 'cmmn-js/lib/util/ModelUtil';
import { isIdValid } from '../../../utils';

/**
 * Свойство "Идентификатор элемента"
 */
export default class IdEntry extends PropertiesPanelEntry {
  /**
   * Создать описание свойства "Идентификатор элемента"
   * @param {EntryFactory} entryFactory - Фабрика элементов панели свойств
   * @param {Function} translate - Функция перевода
   * @param {Object} options - Текущий выбранный элемент диаграммы
   */
  constructor(entryFactory, translate, options) {
    const textField = entryFactory.textField({
      id: options.id || 'id',
      label: options.label || translate('Id'),
      model: options.model || 'id',
      reference: options.reference,
      get: options.get,
      set: options.set,
      validate: function (element, value) {
        let idValue = value,
          bo = getBusinessObject(element);

        bo = (options.reference && options.reference === '$parent') ? bo.$parent : bo.get(options.reference) || bo;

        let idError = isIdValid(bo, idValue);

        return idError ? idError : true;
      }
    });

    super(textField.type, textField.data);
  }
}