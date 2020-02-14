import { PropertiesPanelGroup } from '../../../Models.js';
import { addDefinitionProps } from '../props';
import { Diagram } from '../../../../../api/models';
import EntryFactory from '../../CmmnEntryFactory';


/**
 * Группа "Детали определения"
 */
export default class DetailsGroup extends PropertiesPanelGroup {
  /**
   * Создать группу
   * @param {Diagram} diagram - Текущая диаграмма
   * @param {Object} element - Текущий выбранный элемент диаграммы
   * @param {EntryFactory} entryFactory - Фабрика элементов панели свойств
   * @param {Object} elementRegistry - Регистр элементов
   * @param {Function} translate - Функция перевода
   */
  constructor(element, entryFactory, elementRegistry, translate) {
    super('definitionDetails', translate('Details'), []);

    addDefinitionProps(this, element, entryFactory, elementRegistry, translate);
  }
}