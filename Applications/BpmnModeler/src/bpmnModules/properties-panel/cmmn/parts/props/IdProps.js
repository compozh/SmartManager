import * as elementHelper from '../../helpers/CmmnElementHelper';
import { PropertiesPanelGroup } from '../../../Models';
import EntryFactory from '../../CmmnEntryFactory';
import { IdEntry } from '../entries';

/**
 * Добавить в группу свойства идентификатора
 * @param {PropertiesPanelGroup} group - Группа
 * @param {Object} element - Текущий выбранный элемент диаграммы
 * @param {EntryFactory} entryFactory - Фабрика элементов панели свойств
 * @param {Function} translate - Функция перевода
 */
export default function NameProps(group, element, entryFactory, translate) {
  group.entries.push(new IdEntry(entryFactory, translate, {
    reference: elementHelper.isCMMNEdge(element) ? 'cmmnElementRef' : undefined
  }));
}