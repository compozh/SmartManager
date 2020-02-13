import { isOnPartConnection, getOutgoingOnParts } from '../../helpers/CmmnElementHelper';
import * as cmdHelper from '../../helpers/CmdHelper';
import { isLabel } from 'cmmn-js/lib/features/modeling/util/ModelingUtil';
import { PropertiesPanelGroup } from '../../../Models';
import EntryFactory from '../../CmmnEntryFactory';
import { TransitionEntry } from '../entries';

/**
 * Добавить в группу свойства наименования
 * @param {PropertiesPanelGroup} group - Группа
 * @param {Object} element - Текущий выбранный элемент диаграммы
 * @param {EntryFactory} entryFactory - Фабрика элементов панели свойств
 * @param {Function} translate - Функция перевода
 */
export default function NameProps(group, element, entryFactory, translate) {
  if (!isOnPartConnection(element)) {
    return;
  }

  group.entries.push(new TransitionEntry(element, entryFactory, translate, {
    id: 'onPartStandardEvent',
    label: translate('Standard Event'),
    reference: 'cmmnElementRef',
    model: 'standardEvent',
    set: function (element, value, bo) {
      var connection = !isLabel(element) ? element : element.labelTarget,
        source = connection.source,
        changed = getOutgoingOnParts(source, bo) || [],
        standardEvent = value || undefined;

      if (changed.indexOf(element) === -1) {
        changed.push(element);
      }

      return cmdHelper.updateProperties(bo, { standardEvent: standardEvent }, changed);

    },
    validate: function (element, value) {
      return !!value ||  translate('Must provide a standard event');
    }
  }));

  group.entries.push(entryFactory.checkbox({
    id: 'onPartIsStandardEventVisible',
    label: 'Show Standard Event',
    model: 'isStandardEventVisible'
  }));
}