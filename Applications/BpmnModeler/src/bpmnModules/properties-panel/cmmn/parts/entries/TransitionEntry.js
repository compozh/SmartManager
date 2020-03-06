import { PropertiesPanelEntry } from '../../../Models';
import EntryFactory from '../../CmmnEntryFactory';
import { isOnPartConnection } from '../../helpers/CmmnElementHelper';
import { getStandardEvents, getTransitions } from 'cmmn-js/lib/util/ModelUtil';

/**
 * Свойство "Тип перехода"
 */
export default class NameEntry extends PropertiesPanelEntry {
  /**
   * Создать описание свойства
   * @param {Object} element - Текущий выбранный элемент диаграммы
   * @param {EntryFactory} entryFactory - Фабрика элементов панели свойств
   * @param {Object} options - Параметры свойства
   * @param {Function} translate - Функция перевода
   */
  constructor(element, entryFactory, translate, options) {

    function getOptions(element, exclude) {
      let events,
        options = [];

      exclude = exclude || [];
      if (typeof exclude === 'string') {
        exclude = [exclude];
      }
      if (!isOnPartConnection(element)) {
        events = getTransitions(element);
      } else {
        events = getStandardEvents(element);
      }
      events.forEach(e => {
        if (exclude.indexOf(e) === -1) {
          options.push({ name: translate(e), value: e });
        }
      });
      return options;
    }

    options = options || {};

    const id = options.id,
      label = options.label,
      model = options.model,
      reference = options.reference,
      getter = options.get,
      setter = options.set,
      exclude = options.exclude,
      validator = options.validate;

    const transitionEntry = entryFactory.selectBox({
      id: id || 'transition',
      label: label || 'Transition',
      model: model || 'transition',
      reference: reference,
      items: getOptions(element, exclude),
      get: getter || function (element, bo) {
        return (bo && bo.get(model)) || '';
      },
      set: setter,
      validate: validator,
    });
    super(transitionEntry.type, transitionEntry.data);
  }
}