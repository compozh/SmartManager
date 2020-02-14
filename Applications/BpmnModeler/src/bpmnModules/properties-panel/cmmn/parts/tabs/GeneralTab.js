import { PropertiesPanelTab } from '../../../Models';
import { GeneralGroup, DocumentationGroup, DetailsGroup } from '../groups';

/**
 * Вкладка "Общие"
 */
export default class GeneralTab extends PropertiesPanelTab {
  /**
   * Создать описание вкладки "Общие"
   * @param {Diagram} diagram - Текущая диаграмма
   * @param {Object} element - Текущий выбранный элемент диаграммы
   * @param {Object} entryFactory - Фабрика элементов панели свойсв 
   * @param {Object} canvas - Полотно конструктора cmmn
   * @param {Object} cmmnFactory - Фабрика элемнтов cmmn 
   * @param {Object} commandStack - Стек команд
   * @param {Function} translate - Функция перевода
   */
  constructor(diagram, element, entryFactory, canvas, cmmnFactory, commandStack, translate) {
    const groups = [];

    groups.push(new GeneralGroup(element, entryFactory, canvas, cmmnFactory, translate));
    groups.push(new DetailsGroup(diagram, element, entryFactory, cmmnFactory, commandStack, translate));
    groups.push(new DocumentationGroup(element, entryFactory, cmmnFactory, translate));

    super('general', translate('General'), groups.filter(group => group.entries.length > 0));
  }
}