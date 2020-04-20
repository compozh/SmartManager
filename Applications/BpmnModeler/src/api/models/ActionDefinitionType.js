/** @module models */

/**
 * @typedef {string} ActionDefinitionType
 */

/**
 * Типы действий
 * @readonly
 * @enum {ActionDefinitionType}
 */
export default {
  ExternalTask: 'EXTERNAL_TASK',
  UserTask: 'USER_TASK',
  ExecutionEventHandler: 'EXECUTION_EVENT_HANDLER',
  UserTaskEventHandler: 'USER_TASK_EVENT_HANDLER'
};