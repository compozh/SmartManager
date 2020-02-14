import ImplementationTypeHelper from '../../helpers/ImplementationTypeHelper';
import * as cmdHelper from '../../helpers/CmdHelper';
import { ImplementationTypeEntry } from '../entries';
import EntryFactory from '../../../EntryFactory';
import { PropertiesPanelGroup } from '../../../Models';
import { Diagram, ActionDefinitionType } from '../../../../../api/models';
import { api } from '../../../../../api/bpmnApi';
import { setServiceTaskParameters } from '../../../utils';
import { eventBus } from '../../../../../main';
import { events } from '../../../../../constants';
import { is } from 'bpmn-js/lib/util/ModelUtil';

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

  var hasExternalSupport = isExternalCapable(getBusinessObject(element));

  group.entries.push(new ImplementationTypeEntry(entryFactory, bpmnFactory, translate, {
    getBusinessObject: getBusinessObject,
    getImplementationType: getImplementationType,
    hasExternalSupport: hasExternalSupport,
    hasServiceTaskLikeSupport: true
  }));

  if (isExternal(element)) {
    var bo = getBusinessObject(element);

    group.entries.push(
      entryFactory.autocompleteBox({
        id: 'externalTopic',
        label: translate('Action'),
        model: 'externalTopic',
        loadItems: api.getActions(ActionDefinitionType.ExternalTask, diagram.isSystem),
        get() {
          return bo.get('camunda:topic');
        },
        set(element, value) {
          return cmdHelper.updateBusinessObject(element, bo, {
            'camunda:topic': value
          });
        },
        appendIcon: 'mdi-magnify',
        append() {
          const value = bo.get('camunda:topic');
          eventBus.$emit(events.propertiesPanel.selectAction, value, ActionDefinitionType.ExternalTask, (newValue) => {
            var cmd = cmdHelper.updateBusinessObject(element, bo, {
              'camunda:topic': newValue
            });
            commandStack.execute(cmd.cmd, cmd.context);
          });
        }
      }),
      entryFactory.button({
        id: 'externalTaskProperties',
        label: translate('Task properties'),
        disabled(element) {
          var bo = getBusinessObject(element);
          var taskCode = bo.get('camunda:topic');
          return typeof taskCode !== 'string' || taskCode.trim() === '';
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

function isExternalCapable(element) {
  return ImplementationTypeHelper.isExternalCapable(element);
}

function isServiceTaskLike(element) {
  // для DMN отдельная обработка
  return ImplementationTypeHelper.isServiceTaskLike(element) && !is(element, 'bpmn:BusinessRuleTask');
}

function isExternal(element) {
  return getImplementationType(element) === 'external';
}