import flattenDeep from 'lodash/flattenDeep';
import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';
import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';
import elementHelper from 'bpmn-js-properties-panel/lib/helper/ElementHelper';
import extensionElementsHelper from 'bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper'
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { eventBus } from '../../../../main';
import ActionDefinitionType from '../../../../api/models/ActionDefinitionType';

function executeCommands(commandStack, commands, element) {
  var commandToExecute;

  if (commands.length > 1) {
    commandToExecute = {
      cmd: 'properties-panel.multi-command-executor',
      context: flattenDeep(commands)
    };
  } else {
    commandToExecute = commands[0];
  }

  if (commandToExecute) {
    commandStack.execute(commandToExecute.cmd, commandToExecute.context || { element: element });
  }
}

export default function (group, element, bpmnFactory, translate, commandStack) {

  if (!is(element, 'IT-Enterprise:UserTask')) {
    return;
  }

  var topicEntry = entryFactory.textField({
    id: 'actionDefinitionId',
    label: translate('Task creation rule'),
    modelProperty: 'actionDefinitionId',

    buttonAction: {
      name: 'search',
      method: (element, inputNode) => {
        var definitionType = ActionDefinitionType.UserTask;
        var bo = getBusinessObject(element);
        eventBus.$emit('properties-panel.select-external-task', bo.get('IT-Enterprise:actionDefinitionId'), definitionType, (newValue) => {

          var cmd = cmdHelper.updateBusinessObject(element, bo, {
            'IT-Enterprise:actionDefinitionId': newValue
          });
          commandStack.execute(cmd.cmd, cmd.context);
        });
        return true;
      }
    },
    buttonShow: {
      name: 'canSearch',
      method: (element, inputNode) => true
    },

    get: function (element, node) {
      var bo = getBusinessObject(element);
      return { actionDefinitionId: bo.get('IT-Enterprise:actionDefinitionId') };
    },

    set: function (element, values, node) {
      var bo = getBusinessObject(element);
      return cmdHelper.updateBusinessObject(element, bo, {
        'IT-Enterprise:actionDefinitionId': values.actionDefinitionId
      });
    },

    validate: function (element, values, node) {
      return is(element, 'IT-Enterprise:UserTask') && !values.actionDefinitionId ? { actionDefinitionId: translate('Must provide a value') } : {};
    },

    hidden: function (element, node) {
      return !is(element, 'IT-Enterprise:UserTask');
    }

  });

  var taskProperties = entryFactory.link({
    id: 'externalTaskProperties',
    label: translate('Task properties'),
    showLink: (element, node) => {
      if (!is(element, 'IT-Enterprise:UserTask')) {
        return false;
      }
      var bo = getBusinessObject(element);
      var taskCode = bo.get('IT-Enterprise:actionDefinitionId');
      return taskCode && taskCode.trim() !== ''
    },
    handleClick: (element, node, event) => {
      var bo = getBusinessObject(element);
      var taskCode = bo.get('IT-Enterprise:actionDefinitionId');
      // Вызываем событие для ввода параметров задачи
      // По событию должен открыться диалог ввода параметров
      // Параметры собития: код задачи из таблицы WFEXEC и callback, в который будут переданы новые параметры 
      eventBus.$emit('properties-panel.set-external-task-properties', taskCode, (parameters) => {
        // Если не получили новые парамерты - ничего не делаем
        if (!parameters || !parameters.length) {
          return;
        }

        var commands = [];

        // Получаем элемент bpmn:ExtensionElements для хранения параметров
        var extensionElements = bo.get('extensionElements');
        if (!extensionElements) {
          extensionElements = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory);
          commands.push(cmdHelper.updateBusinessObject(element, bo, { 'extensionElements': extensionElements }));
        }

        // Уже сохраненные параметры
        var existingParameters = extensionElementsHelper.getExtensionElements(bo, 'IT-Enterprise:ServiceTaskParameter');

        // Записываем новые параметры и удаляем старые
        commands.push(cmdHelper.addAndRemoveElementsFromList(element, extensionElements, 'values', 'extensionElements', parameters.map(p =>
          elementHelper.createElement('IT-Enterprise:ServiceTaskParameter', {
            'name': p.name,
            'type': p.type,
            'value': p.value
          }, extensionElements, bpmnFactory)), existingParameters));

        // Применить изменения
        executeCommands(commandStack, commands, element);
      });
    }
  });

  group.entries = group.entries.concat([topicEntry, taskProperties]);
}