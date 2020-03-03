import ImplementationTypeHelper from '../../helpers/ImplementationTypeHelper';
import * as cmdHelper from '../../helpers/CmdHelper';
import { ImplementationTypeEntry } from '../entries';
import EntryFactory from '../../../EntryFactory';
import { PropertiesPanelGroup } from '../../../Models';
import { Diagram, ActionDefinitionType } from '../../../../../api/models';
import { api } from '../../../../../api/bpmnApi';
import { setServiceTaskParameters, findDataObject, setBusinessObjectActionParameters } from '../../../utils';
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

  // Проверить наличие бизнес-объектов, привязанных к DataObjectReference
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

  const isBoAction = isBusinesssObjectAction(element),
    isBoAccess = isBusinesssObjectAccess(element);

  // Обработка для внешних задач не по бизнес-объектам
  if (isExternal(element) && !(isBoAction || isBoAccess)) {
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

  // Действия и настройки доступа к бизнес-объектам привязываются только к сервисным задачам
  if (is(element, 'bpmn:ServiceTask')) {
    const businessObject = getServiceTaskLikeBusinessObject(element);

    if (isBoAction || isBoAccess) {
      const selectedBusinessObjects = elementRegistry
        .filter((e) => {
          if (!is(e, 'bpmn:DataObjectReference')) {
            return false;
          }
          const bo = getBusinessObject(e);
          const reference = bo.get('dataObjectRef');
          if (!reference) {
            return false;
          }
          const boDefCode = reference.get('IT-Enterprise:businessObjectDefinitionCode');
          return typeof boDefCode === 'string' && boDefCode.trim() != '';
        }).map(e => {
          const bo = getBusinessObject(e);
          const reference = bo.get('dataObjectRef');
          return {
            value: reference.id,
            name: bo.name
          };
        });
      
      const dataObjectRef = businessObject.get('IT-Enterprise:dataObjectRef');
      
      group.entries.push(entryFactory.selectBox({
        id: 'boDefCode',
        label: translate('Data Object'),
        model: 'IT-Enterprise:dataObjectRef',
        items: selectedBusinessObjects,
        get: () => dataObjectRef ? dataObjectRef.get('id') : undefined,
        set: (element, value) => {
          const bo = getBusinessObject(element);
          const dataObject = findDataObject(bo, value);
          return cmdHelper.updateBusinessObject(element, bo, {
            'IT-Enterprise:dataObjectRef': dataObject,
            'camunda:topic': undefined
          });
        }
      }));
  
      const boDefCode = dataObjectRef ? dataObjectRef.get('IT-Enterprise:businessObjectDefinitionCode') : undefined;
      if (typeof boDefCode === 'string' && boDefCode.trim() !== '') {
        if (isBoAction) {
          group.entries.push(entryFactory.autocompleteBox({
            id: 'boActDefCode',
            label: translate('Business Object Action'),
            model: 'camunda:topic',
            loadItems: (async () => (await api.getBusinessObjectActions(boDefCode, diagram.isSystem))
              .map(act => ({ id: act.logicalKey, name: act.name })))(),
            appendIcon: 'mdi-magnify',
            append: () => {
              eventBus.$emit(events.propertiesPanel.selectBusinessObjectAction,
                boDefCode,
                businessObject.get('camunda:topic'),
                diagram.isSystem,
                (newValue) => {
                  var cmd = cmdHelper.updateBusinessObject(element, businessObject, {
                    'camunda:topic': newValue,
                  });
                  commandStack.execute(cmd.cmd, cmd.context);
                });
            }
          }));

          const topic = businessObject.get('camunda:topic');
          if (typeof topic === 'string' && topic.trim() != '') {
            console.log('camunda:topic');
            api.getBusinessObjectActions(boDefCode, diagram.isSystem).then((actions) => {
              const action = actions.find(act => act.logicalKey === topic);
              if (!action || !action.parametersExists) {
                console.log(action);
                return;
              }
              group.entries.push(entryFactory.button({
                id: 'boActDefCodeParams',
                label: translate('Action Properties'),
                click(element) {
                  setBusinessObjectActionParameters(element, businessObject, topic, bpmnFactory, commandStack);
                }
              }));
            });
          }
        } else if (isBoAccess) {
          group.entries.push(entryFactory.autocompleteBox({
            id: 'boAccDefCode',
            label: translate('Business Object Access'),
            model: 'camunda:topic',
            loadItems: (async () => (await api.getBusinessObjectAccess(boDefCode, diagram.isSystem))
              .map(act => ({ id: `${act.boDefCode}.${act.accessDefCode}`, name: act.name })))(),
            appendIcon: 'mdi-magnify',
            append: () => {
              eventBus.$emit(events.propertiesPanel.selectBusinessObjectAccess,
                boDefCode,
                businessObject.get('camunda:topic'),
                diagram.isSystem,
                (newValue) => {
                  var cmd = cmdHelper.updateBusinessObject(element, businessObject, {
                    'camunda:topic': newValue,
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

/**
 * Проверить, является ли элемент действием над бизнес-объектом
 * @param {*} element 
 */
function isBusinesssObjectAction(element) {
  return getImplementationType(element) === 'businessObjectAction';
}

/**
 * Проверить, является ли элемент настройкой доступа к бизнес-объекту
 * @param {*} element
 */
function isBusinesssObjectAccess(element) {
  return getImplementationType(element) === 'businessObjectAccess';
}