import { PropertiesPanelTab } from '../../../Models';
import { DefinitionGroup, DefinitionDocumentationGroup } from '../groups';

/**
 * Вкладка "Опреление"
 */
export default class DefinitionTab extends PropertiesPanelTab {
  /**
   * Создать описание вкладки "Опреление"
   * @param {Object} element - Текущий выбранный элемент диаграммы
   * @param {Object} entryFactory - Фабрика элементов панели свойсв 
   * @param {Object} cmmnFactory - Фабрика элемнтов cmmn 
   * @param {Object} elementRegistry - Регистр элементов
   * @param {Function} translate - Функция перевода
   */
  constructor(element, entryFactory, cmmnFactory, elementRegistry, translate) {
    const groups = [];

    groups.push(new DefinitionGroup(element, entryFactory, elementRegistry, translate));
    groups.push(new DefinitionDocumentationGroup(element, entryFactory, cmmnFactory, translate));

    super('definition', translate('Definition'), groups.filter(group => group.entries.length > 0));
  }
}