import { PropertiesPanelGroup } from '../../../Models';
import EntryFactory from '../../CmmnEntryFactory';
import { DocumentationEntry } from '../entries';
import * as elementHelper from '../../helpers/CmmnElementHelper';

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

    if (elementHelper.isCMMNEdge(element) && elementHelper.isDiscretionaryConnection(element)) {
      return;
    }

    this.entries.push(new DocumentationEntry(entryFactory, cmmnFactory, translate, {
      reference: elementHelper.isCMMNEdge(element) ? 'cmmnElementRef' : undefined
    }));
  }
}

