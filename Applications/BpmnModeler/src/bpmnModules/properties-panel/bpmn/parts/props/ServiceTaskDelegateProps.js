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
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

/**
 * Добавить в группу свойсва сервисной задачи
 * @param {PropertiesPanelGroup} group - Группа
 * @param {Diagram} diagram - Текущая диаграмма
 * @param {Object} element - Текущий выбранный элемент диаграммы
 * @param {EntryFactory} entryFactory - Фабрика элементов панели свойств
 * @param {Object} bpmnFactory - Фабрика bpmn  элементов
 * @param {Object} commandStack - Стек комманд
 * @param {Object} elementRegistry - Регистр элементов
 * @param {Function} translate - Функция перевода
 */
export default function addServiceTaskProps(group, diagram, element, entryFactory, bpmnFactory, commandStack, elementRegistry, translate) {
  if (!isServiceTaskLike(element)) {
    return;
  }

  var hasExternalSupport = isExternalCapable(getServiceTaskLikeBusinessObject(element));
  var businessObjectsExists = elementRegistry.filter(element => {
    if (!is(element, 'bpmn:DataObjectReference')) {
      return false;
    }
    var businessObject = getBusinessObject(element);
    if (!businessObject) {
      return false;
    }
    var reference = businessObject.get('dataObjectRef');
    if (!reference) {
      return false;
    }
    var boDefCode = reference.get('IT-Enterprise:businessObjectDefinitionCode');
    return typeof boDefCode === 'string' && boDefCode != '';
  }).length > 0;

  group.entries.push(new ImplementationTypeEntry(entryFactory, bpmnFactory, translate, {
    getBusinessObject: getServiceTaskLikeBusinessObject,
    getImplementationType: getImplementationType,
    hasExternalSupport: hasExternalSupport,
    hasServiceTaskLikeSupport: true,
    businessObjectsExists
  }));

  if (isExternal(element)) {
    var bo = getServiceTaskLikeBusinessObject(element);

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
          var bo = getServiceTaskLikeBusinessObject(element);
          var taskCode = bo.get('camunda:topic');
          return typeof taskCode !== 'string' || taskCode.trim() === '';
        },
        click(element) {
          var bo = getServiceTaskLikeBusinessObject(element);
          var actionId = bo.get('camunda:topic');
          setServiceTaskParameters(element, bo, actionId, bpmnFactory, commandStack);
        }
      })
    );
  }

  if (is(element, 'bpmn:ServiceTask')) {
    const isBoAction = isBusinesssObjectAction(element),
      isBoAccess = isBusinesssObjectAccess(element);
    const businessObject = getServiceTaskLikeBusinessObject(element);

    if (isBoAction || isBoAccess) {
      const selectedBusinessObjects = elementRegistry
        .filter((e) => {
          if (!is(e, 'bpmn:DataObjectReference')) {
            return false;
          }
          const bo = getBusinessObject(e);
          if (!bo) {
            return false;
          }
          const reference = bo.get('dataObjectRef');
          if (!reference) {
            return false;
          }
          return true;
        }).map(e => {
          const bo = getBusinessObject(e);
          const reference = bo.get('dataObjectRef');
          return reference.get('IT-Enterprise:businessObjectDefinitionCode');
        });
      
      group.entries.push(entryFactory.autocompleteBox({
        id: 'boDefCode',
        label: translate('Business Object'),
        model: 'IT-Enterprise:businessObjectDefinitionCode',
        loadItems: (async () => (await api.getBusinessObjects(diagram.isSystem))
          .filter(bo => selectedBusinessObjects.indexOf(bo.boDefCode) !== -1)
          .map(bo => ({ id: bo.boDefCode, name: bo.name })))(),
        appendIcon: 'mdi-magnify',
        append: () => {
          eventBus.$emit(events.propertiesPanel.selectBusinessObject, businessObject.get('IT-Enterprise:businessObjectDefinitionCode'), diagram.isSystem, (newValue) => {
            var cmd = cmdHelper.updateBusinessObject(element, businessObject, {
              'IT-Enterprise:businessObjectDefinitionCode': newValue,
              'IT-Enterprise:businessObjectActionDefinitionCode': undefined,
              'IT-Enterprise:businessObjectAccessDefinitionCode': undefined
            });
            commandStack.execute(cmd.cmd, cmd.context);
          });
        }
      }));
  
      const boDefCode = businessObject.get('IT-Enterprise:businessObjectDefinitionCode');
      if (typeof boDefCode === 'string' && boDefCode.trim() !== '') {
        if (isBoAction) {
          group.entries.push(entryFactory.autocompleteBox({
            id: 'boActDefCode',
            label: translate('Business Object Action'),
            model: 'IT-Enterprise:businessObjectActionDefinitionCode',
            loadItems: (async () => (await api.getBusinessObjectActions(boDefCode, diagram.isSystem))
              .map(act => ({ id: act.actionDefCode, name: act.name })))(),
            appendIcon: 'mdi-magnify',
            append: () => {
              eventBus.$emit(events.propertiesPanel.selectBusinessObjectAction,
                businessObject.get('IT-Enterprise:businessObjectDefinitionCode'),
                businessObject.get('IT-Enterprise:businessObjectActionDefinitionCode'),
                diagram.isSystem,
                (newValue) => {
                  var cmd = cmdHelper.updateBusinessObject(element, businessObject, {
                    'IT-Enterprise:businessObjectActionDefinitionCode': newValue,
                  });
                  commandStack.execute(cmd.cmd, cmd.context);
                });
            }
          }));
        } else if (isBoAccess) {
          group.entries.push(entryFactory.autocompleteBox({
            id: 'boAccDefCode',
            label: translate('Business Object Access'),
            model: 'IT-Enterprise:businessObjectAccessDefinitionCode',
            loadItems: (async () => (await api.getBusinessObjectAccess(boDefCode, diagram.isSystem))
              .map(act => ({ id: act.accessDefCode, name: act.name })))(),
            appendIcon: 'mdi-magnify',
            append: () => {
              eventBus.$emit(events.propertiesPanel.selectBusinessObjectAccess,
                businessObject.get('IT-Enterprise:businessObjectDefinitionCode'),
                businessObject.get('IT-Enterprise:businessObjectAccessDefinitionCode'),
                diagram.isSystem,
                (newValue) => {
                  var cmd = cmdHelper.updateBusinessObject(element, businessObject, {
                    'IT-Enterprise:businessObjectAccessDefinitionCode': newValue,
                  });
                  commandStack.execute(cmd.cmd, cmd.context);
                });
            }
          }));
        }
      }
    }
  }
}

function getImplementationType(element) {
  return ImplementationTypeHelper.getImplementationType(element);
}

function getServiceTaskLikeBusinessObject(element) {
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

function isBusinesssObjectAction(element) {
  return getImplementationType(element) === 'businessObjectAction';
}

function isBusinesssObjectAccess(element) {
  return getImplementationType(element) === 'businessObjectAccess';
}