import * as elementHelper from '../../helpers/CmmnElementHelper';
import * as cmdHelper from '../../helpers/CmdHelper';
import { isLabel } from 'cmmn-js/lib/features/modeling/util/ModelingUtil';
import { getName } from 'cmmn-js/lib/util/ModelUtil';
import { PropertiesPanelGroup } from '../../../Models';
import EntryFactory from '../../CmmnEntryFactory';
import { NameEntry } from '../entries';

/**
 * Добавить в группу свойства наименования
 * @param {PropertiesPanelGroup} group - Группа
 * @param {Object} element - Текущий выбранный элемент диаграммы
 * @param {EntryFactory} entryFactory - Фабрика элементов панели свойств
 * @param {Function} translate - Функция перевода
 */
export default function NameProps(group, element, entryFactory, translate) {
  if (elementHelper.isCriterion(element)) {
    return;
  }

  if (elementHelper.isCMMNEdge(element) &&
    (elementHelper.isDiscretionaryConnection(element) ||
    elementHelper.isAssociationConnection(element))) {
    return;
  }

  let setter;
  if (elementHelper.isOnPartConnection(element)) {
    setter = function (element, value, bo) {
      let connection = !isLabel(element) ? element : element.labelTarget,
        source = connection.source,
        changed = elementHelper.getOutgoingOnParts(source, bo) || [],
        name = value || undefined;

      if (changed.indexOf(element) === -1) {
        changed.push(element);
      }
      return cmdHelper.updateProperties(bo, { name: name }, changed);

    };
  }

  group.entries.push(new NameEntry(entryFactory, translate, {
    model: elementHelper.isTextAnnotation(element) ? 'text' : 'name',
    reference: elementHelper.isCMMNEdge(element) ? 'cmmnElementRef' : undefined,
    get: (element, bo) => {
      if (elementHelper.isTextAnnotation(bo)) {
        return bo.text;
      }
      return getName(bo);
    },
    set: setter
  }));
}