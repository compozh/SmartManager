import * as cmdHelper from '../../helpers/CmdHelper';
import { getDefinition, isCasePlanModel } from 'cmmn-js/lib/util/ModelUtil';
import { PropertiesPanelGroup } from '../../../Models';
import EntryFactory from '../../CmmnEntryFactory';
import { NameEntry, IdEntry } from '../entries';

/**
 * Добавить в группу свойства определения
 * @param {PropertiesPanelGroup} group - Группа
 * @param {Object} element - Текущий выбранный элемент диаграммы
 * @param {EntryFactory} entryFactory - Фабрика элементов панели свойств
 * @param {Object} itemRegistry - Регистр элементов
 * @param {Function} translate - Функция перевода
 */
export default function DefinitionProps(group, element, entryFactory, itemRegistry, translate) {
  if (!getDefinition(element) || isCasePlanModel(element)) {
    return;
  }

  group.entries.push(new IdEntry(entryFactory, translate, {
    id: 'definitionId',
    label: translate('Definition Id'),
    reference: 'definitionRef'
  }));

  group.entries.push(new NameEntry(entryFactory, translate, {
    id: 'definitionName',
    label: translate('Definition Name'),
    reference: 'definitionRef',
    set: function (element, value, bo) {
      var changed = itemRegistry.getShapes(bo);
      if (changed.indexOf(element) === -1) {
        changed.push(element);
      }
      var props = {
        name: value || undefined
      };
      return cmdHelper.updateProperties(bo, props, changed);
    }
  }));
}