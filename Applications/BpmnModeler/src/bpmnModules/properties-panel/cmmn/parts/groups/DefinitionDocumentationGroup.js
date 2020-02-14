import { PropertiesPanelGroup } from '../../../Models';
import EntryFactory from '../../CmmnEntryFactory';
import { DocumentationEntry } from '../entries';
import { getDefinition, isCasePlanModel } from 'cmmn-js/lib/util/ModelUtil';

/**
 * Группа "Общие" 
 */
export default class DocumentationGroup extends PropertiesPanelGroup {
  /**
   * Создать группу "Общие"
   * @param {Object} element - Текущий элемент диаграммы
   * @param {EntryFactory} entryFactory - Фабрика элементов панели свойств
   * @param {Object} cmmnFactory - Фабрика элементов cmmn
   * @param {Function} translate - Функция перевода
   */
  constructor(element, entryFactory, cmmnFactory, translate) {
    super('documentation', translate('Item Description'), []);

    if (!getDefinition(element) || isCasePlanModel(element)) {
      return;
    }

    this.entries.push(new DocumentationEntry(entryFactory, cmmnFactory, translate, {
      id: 'definitionDocumentation',
      reference: 'definitionRef'
    }));
  }
}

