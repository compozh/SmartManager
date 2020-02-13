import { PropertiesPanelGroup } from '../../../Models.js';
import { addCallableProps } from '../props';
import { Diagram } from '../../../../../api/models';
import EntryFactory from '../../CmmnEntryFactory';


/**
 * Группа "Настройка"
 */
export default class DetailsGroup extends PropertiesPanelGroup {
  /**
   * Создать группу "Настройка"
   * @param {Diagram} diagram - Текущая диаграмма
   * @param {Object} element - Текущий выбранный элемент диаграммы
   * @param {EntryFactory} entryFactory - Фабрика элементов панели свойств
   * @param {Object} cmmnFactory - Фабрика элементов cmmn
   * @param {Object} commandStack - Стек комманд
   * @param {Function} translate - Функция перевода
   */
  constructor(diagram, element, entryFactory, cmmnFactory, commandStack, translate) {
    super('details', translate('Config'), []);

    addCallableProps(this, element, entryFactory, cmmnFactory, commandStack, translate);
  }
}