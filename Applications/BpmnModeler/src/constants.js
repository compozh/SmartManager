/**
 * @callback formCallback
 * @param {string} unformio - код формы
 */

/**
 * @callback actionCallback
 * @param {string} actionId - код задачи
 */

/**
 * @callback setParametersCallback
 * @param {ServiceTaskParameter[]} properties - новые значения параметров
 */


/** События */
export const events = {
  /** События в редакторе bpmn.io */
  modeler: {
    export: 'modeler.export'
  },
  /** События в панели свойств */
  propertiesPanel: {
    /**
     * Отобразить диалог создания формы formio
     * @event PropertiesPanel#createForm
     * @param {formCallback} callback - коллбек, вызываемый при успешном создании формы
     */
    createForm: 'properties-panel.create-form',
    /**
     * Отобразить диалог корректировки формы formio
     * @event PropertiesPanel#editForm
     * @param {string} unformio - код формы, которую нужно отредактировать
     */
    editForm: 'properties-panel.edit-form',

    /**
     * Отобразить диалог выбора формы formio
     * @event PropertiesPanel#selectForm
     * @param {string} unformio - код выбранной формы
     * @param {formCallback} - коллбек, вызываемый после выбора формы
     */
    selectForm: 'properties-panel.select-form',

    /**
     * Отобразить диалог выбора действия
     * @event PropertiesPanel#selectAction
     * @param {string} actionId - код выбранного действия
     * @param {ActionDefinitionType} type - тип задачи
     * @param {formCallback} callback - коллбек, вызываемый после выбора действия
     */
    selectAction: 'properties-panel.select-action',

    /**
     * Отобразить диалог ввода параметров задачи
     * @event PropertiesPanel#setServiceTaskparameters
     * @param {string} actionId - код действия
     * @param {ServiceTaskParameter[]} parameters - сохраненные параметры
     * @param {setParametersCallback} callback - коллбек, вызываемый после ввода значений параметров
     */
    setServiceTaskProperties: 'properties-panel.set-service-task-parameters'
  }
}