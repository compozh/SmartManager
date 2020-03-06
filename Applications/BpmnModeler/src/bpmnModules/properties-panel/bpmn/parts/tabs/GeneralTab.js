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
   * @param {Object} canvas - Полотно конструктора bpmn
   * @param {Object} bpmnFactory - Фабрика элемнтов bpmn 
   * @param {Object} commandStack - Стек команд
   * @param {Function} translate - Функция перевода
   */
  constructor(diagram, element, entryFactory, canvas, bpmnFactory, commandStack, elementRegistry, translate) {
    const groups = [];

    groups.push(new GeneralGroup(element, entryFactory, canvas, bpmnFactory, translate));
    groups.push(new DetailsGroup(diagram, element, entryFactory, bpmnFactory, commandStack, elementRegistry, translate));
    groups.push(new DocumentationGroup(element, entryFactory, bpmnFactory, translate));

    super('general', translate('General'), groups.filter(group => group.entries.length > 0));
  }
}