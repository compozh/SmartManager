import { isCriterion, isItemCapable } from '../../helpers/CmmnElementHelper';
import * as cmdHelper from '../../helpers/CmdHelper';
import { getParent } from 'cmmn-js/lib/features/modeling/util/ModelingUtil';
import { PropertiesPanelGroup } from '../../../Models';
import EntryFactory from '../../CmmnEntryFactory';
import { ConditionEntry } from '../entries';
import { isCasePlanModel, getBusinessObject } from 'cmmn-js/lib/util/ModelUtil';

/**
 * Добавить в группу свойства наименования
 * @param {PropertiesPanelGroup} group - Группа
 * @param {Object} element - Текущий выбранный элемент диаграммы
 * @param {EntryFactory} entryFactory - Фабрика элементов панели свойств
 * @param {Function} translate - Функция перевода
 */
export default function NameProps(group, element, entryFactory, cmmnFactory, translate) {

  function getIfPart(bo) {
    return bo && bo.get('ifPart');
  }

  function getIfPartCondition(bo) {
    var ifPart = getIfPart(bo);
    return ifPart && ifPart.get('condition');
  }


  if (!isCriterion(element)) {
    return;
  }

  group.entries.push(new ConditionEntry(entryFactory, cmmnFactory, translate, {

    id: 'ifPartCondition',
    label: translate('If Part Condition'),
    reference: 'sentryRef',

    getCondition: function (element, bo) {
      return getIfPartCondition(bo);
    },

    createdCondition: function (condition, element, bo) {
      var cmds = [],
        ifPart = getIfPart(bo);

      if (!bo) {
        // criterion without referencing a sentry
        bo = cmmnFactory.create('cmmn:Sentry');

        var container = getSentryParent(element.host),
          criterion = getBusinessObject(element);
        if (container) {
          cmds.push(
            cmdHelper.updateProperties(criterion, { sentryRef: bo }, element),
            cmdHelper.updateSemanticParent(bo, container, 'sentries', element)
          );
        }

      }

      if (!ifPart) {
        ifPart = cmmnFactory.create('cmmn:IfPart');
        cmds.push(
          cmdHelper.updateProperties(bo, { ifPart: ifPart }, element),
          cmdHelper.updateSemanticParent(ifPart, bo, null, element)
        );
      }

      cmds.push(
        cmdHelper.updateProperties(ifPart, { condition: condition }, element),
        cmdHelper.updateSemanticParent(condition, ifPart, null, element)
      );

      return cmds;
    },

    removedCondition: function (condition, element, bo) {
      var cmds = [],
        ifPart = getIfPart(bo);

      if (ifPart) {
        cmds.push(
          cmdHelper.updateProperties(ifPart, { condition: undefined }, element),
          cmdHelper.updateProperties(bo, { ifPart: undefined }, element),
          cmdHelper.updateSemanticParent(ifPart, null, null, element)
        );
      }

      return cmds;
    }
  }));
}

function getSentryParent(host) {

  if (isCasePlanModel(host)) {
    return getBusinessObject(host);
  }

  if (isItemCapable(host)) {
    var bo = getBusinessObject(host);
    return getParent(bo, 'cmmn:PlanFragment');
  }

}