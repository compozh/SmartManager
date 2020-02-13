import { getBusinessObject, isCasePlanModel } from 'cmmn-js/lib/util/ModelUtil';
import * as cmdHelper from '../../helpers/CmdHelper';
import { IdEntry, NameEntry } from '../entries';

/**
 * Добавить в группу свойства наименования
 * @param {PropertiesPanelGroup} group - Группа
 * @param {Object} element - Текущий выбранный элемент диаграммы
 * @param {EntryFactory} entryFactory - Фабрика элементов панели свойств
 * @param {Function} translate - Функция перевода
 */
export default function CaseProps(group, element, entryFactory, translate) {
  if (!isCasePlanModel(element)) {
    return;
  }

  var getValue = function (modelProperty) {
    return function (element) {
      var bo = getBusinessObject(element).$parent;
      return bo.get(modelProperty);
    };
  };

  var setValue = function (modelProperty) {
    return function (element, value) {
      var bo = getBusinessObject(element).$parent;
      var props = {};

      props[modelProperty] = value || undefined;

      return cmdHelper.updateBusinessObject(element, bo, props);
    };
  };

  group.entries.push(new IdEntry(entryFactory, translate, {
    id: 'caseId',
    label: translate('Case Id'),
    reference: '$parent',
    get: getValue('id'),
    set: setValue('id')
  }));

  group.entries.push(new NameEntry(entryFactory, translate, {
    id: 'caseName',
    label: translate('Case Name'),
    get: getValue('name'),
    set: setValue('name')
  }));
}