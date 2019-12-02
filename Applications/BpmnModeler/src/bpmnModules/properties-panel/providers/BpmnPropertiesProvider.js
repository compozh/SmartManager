import { PropertiesPanelTab } from '../Models';
import EntryFactory from '../EntryFactory';
import { GeneralTab, FormsTab } from '../parts/tabs';
import { Diagram } from '../../../api/models';

/**
 * Описание панели свойств для конструктора bpmn
 */
export default class BpmnPropertiesProvider {
  /**
   * @param {Diagram} diagram - Активная диаграммы
   * @param {Object} modeler - Конструктор bpmn
   * @param {Boolean} readonly - Режим для чтения
   */
  constructor(diagram, modeler, readonly) {
    this.diagram = diagram;
    this.modeler = modeler;
    this.readonly = readonly;
  }

  /**
   * Получить описание панели свойств для выбранного элемента
   * @param {Object} element - Текущий активный элемент
   * @returns {PropertiesPanelTab[]} Описание панели свойств
   */
  getTabs(element) {
    const tabs = [],
      translate = getModule(this.modeler, 'translate'),
      commandStack = getModule(this.modeler, 'commandStack'),
      canvas = getModule(this.modeler, 'canvas'),
      bpmnFactory = getModule(this.modeler, 'bpmnFactory'),
      entryFactory = new EntryFactory(element, commandStack, bpmnFactory, this.readonly);

    tabs.push(new GeneralTab(this.diagram, element, entryFactory, canvas, bpmnFactory, commandStack, translate));
    tabs.push(new FormsTab(this.diagram, element, entryFactory, commandStack, bpmnFactory, translate));

    return tabs.filter(tab => tab.groups.length > 0);
  }
}

/**
 * Получить модуль по названию
 * @param {Object} modeler - Конструктор bpmn
 * @param {string} module - Название модуля
 * @returns {Object|null} Модуль
 */
function getModule(modeler, module) {
  if (!modeler) {
    return null;
  }
  try {
    return modeler.get(module);
  } catch {
    return null;
  }
}