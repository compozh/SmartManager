import { PropertiesPanelGroup } from '../../../Models.js';
import { addCallableProps, addOnPartProps, addHumanTaskProps, addCriterionProps } from '../props';
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

    addOnPartProps(this, element, entryFactory, translate);
    addCallableProps(this, element, entryFactory, cmmnFactory, commandStack, translate);
    addHumanTaskProps(this, diagram, element, entryFactory, cmmnFactory, commandStack, translate);
    addCriterionProps(this, element, entryFactory, cmmnFactory, translate);
  }
}