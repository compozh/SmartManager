import { PropertiesPanelGroup } from '../../../Models.js';
import { addUserTaskProps, addServiceTaskProps, addConditionalProps, addCallActivityProps, addBusinessRuleProps, addDataObjectReferenceProps } from '../props';
import { Diagram } from '../../../../../api/models';
import EntryFactory from '../../../EntryFactory';
import addEventProps from '../props/EventProps';

/**
 * Группа "Настройка"
 */
export default class DetailsGroup extends PropertiesPanelGroup {
  /**
   * Создать группу "Настройка"
   * @param {Diagram} diagram - Текущая диаграмма
   * @param {Object} element - Текущий выбранный элемент диаграммы
   * @param {EntryFactory} entryFactory - Фабрика элементов панели свойств
   * @param {Object} bpmnFactory - Фабрика элементов bpmn
   * @param {Object} commandStack - Стек комманд
   * @param {Function} translate - Функция перевода
   */
  constructor(diagram, element, entryFactory, bpmnFactory, commandStack, elementRegistry, translate) {
    super('details', translate('Config'), []);

    addUserTaskProps(this, diagram, element, entryFactory, bpmnFactory, commandStack, translate);
    addServiceTaskProps(this, diagram, element, entryFactory, bpmnFactory, commandStack, elementRegistry, translate);
    addEventProps(this, element, entryFactory, bpmnFactory, commandStack, translate);
    addConditionalProps(this, element, entryFactory, bpmnFactory, translate);
    addCallActivityProps(this, element, entryFactory, bpmnFactory, commandStack, translate);
    addBusinessRuleProps(this, element, entryFactory, commandStack, translate);
    addDataObjectReferenceProps(this, diagram, element, entryFactory, translate);
  }
}