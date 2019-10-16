'use strict';

import flattenDeep from 'lodash/flattenDeep';
import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';
import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';
import elementHelper from 'bpmn-js-properties-panel/lib/helper/ElementHelper';
import extensionElementsHelper from 'bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper'
import { is } from 'bpmn-js/lib/util/ModelUtil';
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

export default function (element, bpmnFactory, options, translate, commandStack) {

  var getImplementationType = options.getImplementationType,
    getBusinessObject = options.getBusinessObject;

  function isExternal(element) {
    return getImplementationType(element) === 'external';
  }

  var topicEntry = entryFactory.textField({
    id: 'externalTopic',
    label: translate('Topic'),
    modelProperty: 'externalTopic',

    buttonAction: {
      name: 'search',
      method: (element, inputNode) => {
        var definitionType = is(element, 'bpmn:UserTask') ? ActionDefinitionType.UserTask : ActionDefinitionType.ExternalTask;
        var bo = getBusinessObject(element);
        eventBus.$emit('properties-panel.select-external-task', bo.get('camunda:topic'), definitionType, (newValue) => {
          
          var cmd = cmdHelper.updateBusinessObject(element, bo, {
            'camunda:topic': newValue
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
      return { externalTopic: bo.get('camunda:topic') };
    },

    set: function (element, values, node) {
      var bo = getBusinessObject(element);
      return cmdHelper.updateBusinessObject(element, bo, {
        'camunda:topic': values.externalTopic
      });
    },

    validate: function (element, values, node) {
      return isExternal(element) && !values.externalTopic ? { externalTopic: translate('Must provide a value') } : {};
    },

    hidden: function (element, node) {
      return !isExternal(element);
    }

  });

  var taskProperties = entryFactory.link({
    id: 'externalTaskProperties',
    label: translate('Task properties'),
    showLink: (element, node) => {
      if (!isExternal(element)) {
        return false;
      }
      var bo = getBusinessObject(element);
      var taskCode = bo.get('camunda:topic');
      return taskCode && taskCode.trim() !== ''
    },
    handleClick: (element, node, event) => {
      var bo = getBusinessObject(element);
      var taskCode = bo.get('camunda:topic');
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

  return [ topicEntry, taskProperties];

}
