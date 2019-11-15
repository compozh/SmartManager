import flattenDeep from 'lodash/flattenDeep';
import elementHelper from 'bpmn-js-properties-panel/lib/helper/ElementHelper';
import extensionElementsHelper from 'bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper';
import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';
import { eventBus } from '../../main';
import { events } from '../../constants';

/**
 * Выполнить несколько команд одной командой
 * @param {Object[]} commands - команды, которые необходимо выполнить
 * @returns {Object} Комманда, выполняющая несколько комманд
 */
export function concatCommands(commands) {
  var commandToExecute;

  if (commands.length > 1) {
    commandToExecute = {
      cmd: 'properties-panel.multi-command-executor',
      context: flattenDeep(commands)
    };
  } else {
    commandToExecute = commands[0];
  }

  return commandToExecute;
}

/**
 * Установить параметры для сервисной или пользовательской задачи
 * @param {Object} element - пользовательская/сервисная задача
 * @param {Object} bo - бизнес-обьект
 * @param {Object} actionId - сохраненный код действия
 * @param {Object} bpmnFactory - фабрика элементов
 * @param {Object} commandStack - стек команд
 */
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
    const command = concatCommands(commands);
    if (command) {
      commandStack.execute(command.cmd, command.context || { element: element });
    }
  });
}