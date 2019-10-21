import flattenDeep from 'lodash/flattenDeep';
import elementHelper from 'bpmn-js-properties-panel/lib/helper/ElementHelper';
import extensionElementsHelper from 'bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper';
import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';
import { eventBus } from '../../../main';
import { events } from '../../../constants';

/**
 * Выполнить несколько команд одной командой
 * @param {Object} commandStack - стек команд
 * @param {Object[]} commands - команды, которые необходимо выполнить
 * @param {Object} element - элемент, для которого выполняются команды
 */
export function executeCommands(commandStack, commands, element) {
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

export function setServiceTaskParameters(element, bo, actionId, bpmnFactory, commandStack) {
  // Уже сохраненные параметры
  var existingParameters = extensionElementsHelper.getExtensionElements(bo, 'IT-Enterprise:ServiceTaskParameter');

  // Вызываем событие для ввода параметров задачи
  // По событию должен открыться диалог ввода параметров
  // Параметры собития: код действия из таблицы WFEXEC, значения введенных ранее параметров и callback, в который будут переданы новые параметры 
  eventBus.$emit(events.propertiesPanel.setServiceTaskProperties, actionId, existingParameters, (parameters) => {
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

    // Записываем новые параметры и удаляем старые
    commands.push(cmdHelper.addAndRemoveElementsFromList(element, extensionElements, 'values', 'extensionElements', parameters.map(param =>
      elementHelper.createElement('IT-Enterprise:ServiceTaskParameter', param, extensionElements, bpmnFactory)), existingParameters));

    // Применить изменения
    executeCommands(commandStack, commands, element);
  });
}