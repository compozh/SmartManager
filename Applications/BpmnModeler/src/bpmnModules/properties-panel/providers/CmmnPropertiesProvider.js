import { PropertiesPanelTab } from '../Models';
import EntryFactory from '../cmmn/CmmnEntryFactory';
import { GeneralTab, DefinitionTab } from '../cmmn/parts/tabs';
import { Diagram } from '../../../api/models';

/**
 * Описание панели свойств для конструктора cmmn
 */
export default class CmmnPropertiesProvider {
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
      cmmnFactory = getModule(this.modeler, 'cmmnFactory'),
      elementRegistry = getModule(this.modeler, 'elementRegistry'),
      entryFactory = new EntryFactory(element, commandStack, cmmnFactory, this.readonly);

    tabs.push(new GeneralTab(this.diagram, element, entryFactory, canvas, cmmnFactory, commandStack, translate));
    tabs.push(new DefinitionTab(element, entryFactory, cmmnFactory, elementRegistry, translate));

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