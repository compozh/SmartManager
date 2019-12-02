import { PropertiesPanelTab } from '../../Models';
import { FormsGroup, SimpleFormGroup } from '../groups';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { Diagram } from '../../../../api/models';
import EntryFactory from '../../EntryFactory';

/**
 * Вкладка "Формы"
 */
export default class FormsTab extends PropertiesPanelTab {
  /**
   * Создать вкладку "Формы"
   * @param {Diagram} diagram - Текущая диаграмма
   * @param {Object} element - Текущий выбранный элемент диаграммы
   * @param {EntryFactory} entryFactory - Фабрика элементов панели свойств
   * @param {Object} commandStack - Стек комманд
   * @param {Function} translate - Функция перевода
   */
  constructor(diagram, element, entryFactory, commandStack, bpmnFactory, translate) {
    super('forms', translate('Forms'), []);

    if (ensureFormKeyAndDataSupported(element)) {
      this.groups.push(new FormsGroup(diagram, element, entryFactory, commandStack, translate));
      this.groups.push(new SimpleFormGroup(element, entryFactory, bpmnFactory, translate));
    }
  }
}

function ensureFormKeyAndDataSupported(element) {
  return (
    is(element, 'bpmn:StartEvent') && !is(element.parent, 'bpmn:SubProcess')
  ) || is(element, 'bpmn:UserTask');
}