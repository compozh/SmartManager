import { PropertiesPanelGroup } from '../../../Models';
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import EntryFactory from '../../../EntryFactory';
import { getExtensionElements, removeEntry } from '../../helpers/ExtensionElementsHelper';
import ImplementationTypeHelper from '../../helpers/ImplementationTypeHelper';
import elementHelper from '../../helpers/ElementHelper';
import * as cmdHelper from '../../helpers/CmdHelper';
import { api } from '../../../../../api/bpmnApi';
import { ActionDefinitionType } from '../../../../../api/models';
import { eventBus } from '../../../../../main';
import { events } from '../../../../../constants';
import { getSelectedBusinessObjects, findDataObject } from '../../helpers/DataObjectHelper';

const CAMUNDA_EXECUTION_LISTENER_ELEMENT = 'camunda:ExecutionListener';
const CAMUNDA_TASK_LISTENER_ELEMENT = 'camunda:TaskListener';

const ACTION_CLASS = 'it.enterprise.engine.executionlisteners.CallAction';
const TASK_ACTION_CLASS = 'it.enterprise.engine.tasklisteners.CallAction';
const BUSINESS_OBJECT_ACTION_CLASS = 'it.enterprise.engine.executionlisteners.CallBusinessObjectAction';
const TASK_BUSINESS_OBJECT_ACTION_CLASS = 'it.enterprise.engine.tasklisteners.CallBusinessObjectAction';

let aListener;

export default class ListenersGroup extends PropertiesPanelGroup {
  /**
   * Создать описание группы "Простая форма"
   * @param {Object} element - текущий выбранный элемент диаграммы
   * @param {EntryFactory} entryFactory - фабрика элементов панели свойств
   * @param {Object} bpmnFactory - фабрика bpmn элементов
   * @param {Function} translate  - функция перевода
   */
  constructor(diagram, element, entryFactory, bpmnFactory, commandStack, elementRegistry, translate) {
    const entries = [];
    const isSequenceFlow = ImplementationTypeHelper.isSequenceFlow(element);


    let bo;

    if (is(element, 'bpmn:FlowElement') || is(element, 'bpmn:Process') || is(element, 'bpmn:Participant')) {
      bo = getBusinessObject(element);
      if (is(element, 'bpmn:Participant')) {
        element = element.processRef;
        bo = bo.get('processRef');
      }

      if (bo) {
        entries.push(entryFactory.extensionElements({
          id: 'listeners-entry',
          label: translate('Listeners'),
          prefix: 'Listener',
          getExtensionElements: () => {
            const listeners = getExtensionElements(bo, CAMUNDA_EXECUTION_LISTENER_ELEMENT);
            return listeners ? listeners.map((listener, index) => ({
              id: index,
              label: getListenerName(listener, translate)
            })) : [];
          },
          createExtensionElement: (extensionElements) => {
            const props = {
              event: isSequenceFlow ? 'take' : 'start',
              class: ACTION_CLASS
            };
            const newElem = elementHelper.createElement(CAMUNDA_EXECUTION_LISTENER_ELEMENT, props, extensionElements, bpmnFactory);
            return cmdHelper.addElementsTolist(element, extensionElements, 'values', [newElem]);
          },
          removeExtensionElement: (idx) => {
            var listeners = getExtensionElements(bo, CAMUNDA_EXECUTION_LISTENER_ELEMENT);
            var listener = listeners ? listeners[idx] : undefined;
            if (listener) {
              return removeEntry(bo, element, listener);
            }
          },
          onActiveElementChanged: (idx) => {
            var listeners = getExtensionElements(bo, CAMUNDA_EXECUTION_LISTENER_ELEMENT);
            var listener = listeners ? listeners[idx] : undefined;
            this.activeListener = aListener = listener;
          }
        }));
      }
    }

    if (is(element, 'bpmn:UserTask')) {
      bo = getBusinessObject(element);

      entries.push(entryFactory.extensionElements({
        id: 'task-listeners-entry',
        label: translate('Task Listeners'),
        prefix: 'Listener',
        getExtensionElements: () => {
          const listeners = getExtensionElements(bo, CAMUNDA_TASK_LISTENER_ELEMENT);
          return listeners ? listeners.map((listener, index) => ({
            id: index,
            label: getListenerName(listener, translate)
          })) : [];
        },
        createExtensionElement: (extensionElements) => {
          const props = {
            event: 'create',
            class: ACTION_CLASS
          };
          const newElem = elementHelper.createElement(CAMUNDA_TASK_LISTENER_ELEMENT, props, extensionElements, bpmnFactory);
          return cmdHelper.addElementsTolist(element, extensionElements, 'values', [newElem]);
        },
        removeExtensionElement: (idx) => {
          var listeners = getExtensionElements(bo, CAMUNDA_TASK_LISTENER_ELEMENT);
          var listener = listeners ? listeners[idx] : undefined;
          if (listener) {
            return removeEntry(bo, element, listener);
          }
        },
        onActiveElementChanged: (idx) => {
          var listeners = getExtensionElements(bo, CAMUNDA_TASK_LISTENER_ELEMENT);
          var listener = listeners ? listeners[idx] : undefined;
          this.activeListener = aListener = listener;
        }
      }));
    }

    super('listeners-group', translate('Listeners'), entries);
    this.entryFactory = entryFactory;
    this.translate = translate;
    this.element = element;
    this.bpmnFactory = bpmnFactory;
    this.diagram = diagram;
    this.commandStack = commandStack;
    this.elementRegistry = elementRegistry;
  }

  activeListener = aListener;

  get entries() {
    const entries = [];

    const listener = this.activeListener,
      element = this.element,
      entryFactory = this.entryFactory,
      translate = this.translate,
      bpmnFactory = this.bpmnFactory,
      diagram = this.diagram,
      commandStack = this.commandStack;

    if (!listener) {
      return this._entries;
    }

    const listenerType = getListenerType(listener);
    const selectedBusinessObjects = getSelectedBusinessObjects(this.elementRegistry);
    const executionListenerEventTypeOptions = ImplementationTypeHelper.isSequenceFlow(element) ? [
      { name: translate('take'), value: 'take' }
    ] : [
      { name: translate('start'), value: 'start' },
      { name: translate('end'), value: 'end' }
    ];
    const taskListenerEventTypeOptions = [
      { name: translate('create'), value: 'create' },
      { name: translate('assignment'), value: 'assignment' },
      { name: translate('complete'), value: 'complete' },
      { name: translate('delete'), value: 'delete' },
      { name: translate('update'), value: 'update' },
      { name: translate('timeout'), value: 'timeout' }
    ];

    entries.push(entryFactory.selectBox({
      id: 'listener-event-type',
      label: translate('Event Type'),
      model: 'event',
      items: ImplementationTypeHelper.isTaskListener(listener) ? taskListenerEventTypeOptions :
        ImplementationTypeHelper.isExecutionListener(listener) ? executionListenerEventTypeOptions : [],
      get: () => listener.get('event'),
      set: (element, value) => cmdHelper.updateBusinessObject(element, listener, { 'event': value })
    }));

    if (is(listener, CAMUNDA_TASK_LISTENER_ELEMENT)) {
      entries.push(entryFactory.textField({
        id: 'listener-id',
        label: translate('Listener Id'),
        model: 'id',
        get: () => listener.get('id'),
        set: (element, value) => cmdHelper.updateBusinessObject(element, listener, { 'id': value })
      }));
    }

    let listenerTypes;
    if (selectedBusinessObjects.length > 0) {
      listenerTypes = [
        { name: translate('Action'), value: 'action' },
        { name: translate('Business Object Action'), value: 'businessObjectAction' },
        { name: translate('Expression'), value: 'expression' },
        { name: translate('Script'), value: 'script' }
      ];
    } else {
      listenerTypes = [
        { name: translate('Action'), value: 'action' },
        { name: translate('Expression'), value: 'expression' },
        { name: translate('Script'), value: 'script' }
      ];
    }

    entries.push(entryFactory.selectBox({
      id: 'listener-type',
      label: translate('Listener Type'),
      model: 'type',
      items: listenerTypes,
      get: () => getListenerType(listener),
      set: (element, value) => {
        const props = {
          'expression': undefined,
          'script': undefined,
          'class': undefined,
          'fields': []
        };

        if (value === 'expression') {
          props.expression = '';
        } else if (value === 'script') {
          props.script = bpmnFactory.create('camunda:Script', { scriptFormat: 'javascript' });
        } else if (value === 'action') {
          props.class = is(listener, CAMUNDA_EXECUTION_LISTENER_ELEMENT) ? ACTION_CLASS : TASK_ACTION_CLASS;
          props.fields.push(bpmnFactory.create('camunda:Field', { name: 'actionCode' }));
        } else if (value === 'businessObjectAction') {
          props.class = is(listener, CAMUNDA_EXECUTION_LISTENER_ELEMENT) ? BUSINESS_OBJECT_ACTION_CLASS : TASK_BUSINESS_OBJECT_ACTION_CLASS;
          props.fields.push(bpmnFactory.create('camunda:Field', { name: 'actionCode' }));
          props.fields.push(bpmnFactory.create('camunda:Field', { name: 'dataObjectId' }));
        }

        return cmdHelper.updateBusinessObject(element, listener, props);
      }
    }));

    if (listenerType === 'expression') {
      entries.push(entryFactory.textField({
        id: 'listener-expression',
        label: translate('Expression'),
        model: 'expression',
        get: () => listener.get('expression'),
        set: (element, value) => cmdHelper.updateBusinessObject(element, listener, { 'expression': value })
      }));
    } else if (listenerType === 'script') {
      entries.push(entryFactory.textArea({
        id: 'listener-script',
        label: translate('Script'),
        model: 'script',
        rows: 3,
        get: () => listener.get('script').get('value'),
        set: (element, value) => cmdHelper.updateBusinessObject(element, listener.get('script'), { value })
      }));
    } else if (listenerType === 'action') {
      const field = listener.get('fields').find(field => field.name === 'actionCode');
      const actionType = is(listener, CAMUNDA_EXECUTION_LISTENER_ELEMENT)
        ? ActionDefinitionType.ExecutionEventHandler
        : ActionDefinitionType.UserTaskEventHandler;

      entries.push(entryFactory.autocompleteBox({
        id: 'listener-action',
        label: translate('Action'),
        model: 'actionCode',
        get: () => field ? field.get('string') : undefined,
        set: (element, value) => cmdHelper.updateBusinessObject(element, field, { 'string': value }),
        loadItems: api.getActions(actionType, diagram.isSystem),
        appendIcon: 'mdi-magnify',
        append() {
          const value = field.get('string');
          eventBus.$emit(events.propertiesPanel.selectAction, value, actionType, (newValue) => {
            var cmd = cmdHelper.updateBusinessObject(element, field, {
              'IT-Enterprise:actionDefinitionId': newValue
            });
            commandStack.execute(cmd.cmd, cmd.context);
          });
        }
      }));
    } else if (listenerType === 'businessObjectAction') {
      const dataObjectField = listener.get('fields').find(field => field.name === 'dataObjectId');
      const actionField = listener.get('fields').find(field => field.name === 'actionCode');
      const dataObject = findDataObject(getBusinessObject(element), dataObjectField.get('string'));

      entries.push(entryFactory.selectBox({
        id: 'boDefCode',
        label: translate('Data Object'),
        model: 'IT-Enterprise:dataObjectRef',
        items: selectedBusinessObjects,
        get: () => dataObject ? dataObject.get('id') : undefined,
        set: (element, value) => {
          return cmdHelper.updateBusinessObject(element, dataObjectField, { 'string': value});
        }
      }));

      const boDefCode = dataObject ? dataObject.get('IT-Enterprise:businessObjectDefinitionCode') : undefined;
      if (boDefCode) {
        entries.push(entryFactory.autocompleteBox({
          id: 'boActDefCode',
          label: translate('Business Object Action'),
          model: 'string',
          loadItems: (async () => (await api.getBusinessObjectActions(boDefCode, diagram.isSystem))
            .map(act => ({ id: act.logicalKey, name: act.name })))(),
          appendIcon: 'mdi-magnify',
          append: () => {
            eventBus.$emit(events.propertiesPanel.selectBusinessObjectAction,
              boDefCode,
              actionField.get('string'),
              diagram.isSystem,
              (newValue) => {
                var cmd = cmdHelper.updateBusinessObject(element, actionField, { 'string': newValue });
                commandStack.execute(cmd.cmd, cmd.context);
              });
          },
          get: () => actionField.get('string'),
          set: (element, value) => cmdHelper.updateBusinessObject(element, actionField, { 'string': value })
        }));
      }
    }

    return this._entries.concat(entries);
  }
}

function getListenerName(listener, translate) {
  const event = (listener.get('event')) ? listener.get('event') : '<empty>';
  const type = getListenerType(listener);
  return `${translate(event)}: ${translate(LISTENER_TYPE_LABEL[type])}`;
}

function getListenerType(listener) {
  if (listener.get('script')) {
    return 'script';
  }
  if (listener.get('class')) {
    const className = listener.get('class');
    if (className == ACTION_CLASS || className == TASK_ACTION_CLASS) {
      return 'action';
    }
    if (className == BUSINESS_OBJECT_ACTION_CLASS || className == TASK_BUSINESS_OBJECT_ACTION_CLASS) {
      return 'businessObjectAction';
    }
    return 'class';
  }
  return 'expression';
}

const LISTENER_TYPE_LABEL = {
  'class': 'Java Class',
  'expression': 'Expression',
  'script': 'Script',
  'action': 'Action',
  'businessObjectAction': 'Business Object Action'
};