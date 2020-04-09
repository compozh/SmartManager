import flattenDeep from 'lodash/flattenDeep';
import elementHelper from './bpmn/helpers/ElementHelper';
import * as extensionElementsHelper from './bpmn/helpers/ExtensionElementsHelper';
import * as cmdHelper from './bpmn/helpers/CmdHelper';
import { eventBus } from '../../main';
import { events } from '../../constants';
import Ids from 'ids';
import { is } from 'bpmn-js/lib/util/ModelUtil';

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

/**
 * Установить параметры для сервисной или пользовательской задачи
 * @param {Object} element - пользовательская/сервисная задача
 * @param {Object} bo - бизнес-обьект
 * @param {string} logicalKey - сохраненный код действия
 * @param {Object} bpmnFactory - фабрика элементов
 * @param {Object} commandStack - стек команд
 */
export function setBusinessObjectActionParameters(element, bo, logicalKey, bpmnFactory, commandStack) {

  var existingParameters = extensionElementsHelper.getExtensionElements(bo, 'IT-Enterprise:ServiceTaskParameter');


  eventBus.$emit(events.propertiesPanel.setBusinessObjectActionProperties, logicalKey, existingParameters, (parameters) => {
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

/**
 * Установить параметры доступа к бизне-объекту
 * @param {Object} element - пользовательская/сервисная задача
 * @param {Object} bo - бизнес-обьект
 * @param {string} logicalKey - сохраненный код действия
 * @param {Object} bpmnFactory - фабрика элементов
 * @param {Object} commandStack - стек команд
 */
export function setBusinessObjectAccessParameters(element, rule, boDefCode, boAccDefCode, bpmnFactory, commandStack) {

  var existingParameters = rule.get('parameters');

  eventBus.$emit(events.propertiesPanel.setBusinessObjectAccessProperties, boDefCode, boAccDefCode, existingParameters, (parameters) => {
    if (!parameters || !parameters.length) {
      return;
    }

    var commands = [];

    // Записываем новые параметры и удаляем старые
    commands.push(cmdHelper.addAndRemoveElementsFromList(element, rule, 'parameters', 'rules',
      parameters.map(param => elementHelper.createElement('IT-Enterprise:BusinessObjectAccessParameter', param, rule, bpmnFactory)), existingParameters));

    // Применить изменения
    const command = concatCommands(commands);
    if (command) {
      commandStack.execute(command.cmd, command.context || { element: element });
    }
  });
}


export function nextId(prefix) {
  var ids = new Ids([32, 32, 1]);

  return ids.nextPrefixed(prefix);
}

/**
 * checks whether the id value is valid
 *
 * @param {ModdleElement} bo
 * @param {String} idValue
 * @param {Function} translate
 *
 * @return {String} error message
 */
export function isIdValid(bo, idValue, translate) {
  var assigned = bo.$model.ids.assigned(idValue);

  var idExists = assigned && assigned !== bo;

  if (!idValue || idExists) {
    return translate('Element must have an unique id.');
  }

  return validateId(idValue, translate);
}

var SPACE_REGEX = /\s/;

// for QName validation as per http://www.w3.org/TR/REC-xml/#NT-NameChar
var QNAME_REGEX = /^([a-z][\w-.]*:)?[a-z_][\w-.]*$/i;

// for ID validation as per BPMN Schema (QName - Namespace)
var ID_REGEX = /^[a-z_][\w-.]*$/i;

var PLACEHOLDER_REGEX = /\$\{([^}]*)\}/g;

function validateId(idValue, translate) {

  idValue = stripPlaceholders(idValue);

  if (containsSpace(idValue)) {
    return translate('Id must not contain spaces.');
  }

  if (!ID_REGEX.test(idValue)) {

    if (QNAME_REGEX.test(idValue)) {
      return translate('Id must not contain prefix.');
    }

    return translate('Id must be a valid QName.');
  }
}

function containsSpace(value) {
  return SPACE_REGEX.test(value);
}

function stripPlaceholders(idValue) {

  // replace expression e.g. ${VERSION_TAG}
  // use only the content between ${}
  // for the REGEX check
  return idValue.replace(PLACEHOLDER_REGEX, '$1');
}

export function findRootElementsByType(businessObject, referencedType) {
  var root = getRoot(businessObject);

  return filterElementsByType(root.rootElements, referencedType);
}

/**
 * filters all elements in the list which have a given type.
 * returns a new list
 */
export function filterElementsByType(objectList, type) {
  var list = objectList || [];
  var result = [];
  list.forEach(function (obj) {
    if (is(obj, type)) {
      result.push(obj);
    }
  });
  return result;
}

/**
 * Retrieve the root element the document this
 * business object is contained in.
 *
 * @return {ModdleElement}
 */
export function getRoot(businessObject) {
  var parent = businessObject;
  while (parent.$parent) {
    parent = parent.$parent;
  }
  return parent;
}