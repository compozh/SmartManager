import ImplementationTypeHelper from 'bpmn-js-properties-panel/lib/helper/ImplementationTypeHelper';
import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';
import { ImplementationTypeEntry } from '../entries';
import EntryFactory from '../../EntryFactory';
import { PropertiesPanelGroup } from '../../Models';
import { Diagram, ActionDefinitionType } from '../../../../api/models';
import { api } from '../../../../api/bpmnApi';
import { setServiceTaskParameters } from '../../utils';

/**
 * Добавить в группу свойсва сервисной задачи
 * @param {PropertiesPanelGroup} group - Группа
 * @param {Diagram} diagram - Текущая диаграмма
 * @param {Object} element - Текущий выбранный элемент диаграммы
 * @param {EntryFactory} entryFactory - Фабрика элементов панели свойств
 * @param {Object} bpmnFactory - Фабрика bpmn  элементов
 * @param {Object} commandStack - Стек комманд
 * @param {Function} translate - Функция перевода
 */
export default function addServiceTaskProps(group, diagram, element, entryFactory, bpmnFactory, commandStack, translate) {
  if (!isServiceTaskLike(element)) {
    return;
  }

  var hasDmnSupport = isDmnCapable(element);
  var hasExternalSupport = isExternalCapable(getBusinessObject(element));

  group.entries.push(new ImplementationTypeEntry(entryFactory, bpmnFactory, translate, {
    getBusinessObject: getBusinessObject,
    getImplementationType: getImplementationType,
    hasDmnSupport: hasDmnSupport,
    hasExternalSupport: hasExternalSupport,
    hasServiceTaskLikeSupport: true
  }));

  if (isExternal(element)) {
    group.entries.push(
      entryFactory.autocompleteBox({
        id: 'externalTopic',
        label: translate('Action'),
        model: 'externalTopic',
        loadItems: api.getActions(ActionDefinitionType.ExternalTask, diagram.isSystem),
        get: function (element) {
          var bo = getBusinessObject(element);
          return bo.get('camunda:topic');
        },

        set: function (element, value) {
          var bo = getBusinessObject(element);
          return cmdHelper.updateBusinessObject(element, bo, {
            'camunda:topic': value
          });
        },
      }),
      entryFactory.button({
        id: 'externalTaskProperties',
        label: translate('Task properties'),
        disabled(element) {
          var bo = getBusinessObject(element);
          var taskCode = bo.get('camunda:topic');
          return typeof taskCode !== 'string' || taskCode.trim() === ''
        },
        click(element) {
          var bo = getBusinessObject(element);
          var actionId = bo.get('camunda:topic');
          setServiceTaskParameters(element, bo, actionId, bpmnFactory, commandStack);
        }
      })
    );
  }
}

function getImplementationType(element) {
  return ImplementationTypeHelper.getImplementationType(element);
}

function getBusinessObject(element) {
  return ImplementationTypeHelper.getServiceTaskLikeBusinessObject(element);
}

function isDmnCapable(element) {
  return ImplementationTypeHelper.isDmnCapable(element);
}

function isExternalCapable(element) {
  return ImplementationTypeHelper.isExternalCapable(element);
}

function isServiceTaskLike(element) {
  return ImplementationTypeHelper.isServiceTaskLike(element);
}

function isExternal(element) {
  return getImplementationType(element) === 'external';
}