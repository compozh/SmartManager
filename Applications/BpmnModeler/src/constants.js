/**
 * @callback formioCallback
 * @param {string} unformio - код формы
 */

/**
 * @callback submitFormioCallback
 * @param {string} submission - данные с формы
 */

/**
 * @callback actionCallback
 * @param {string} actionId - код задачи
 */

/**
 * @callback setParametersCallback
 * @param {ServiceTaskParameter[]} properties - новые значения параметров
 */

/**
 * @callback itemSelectedCallback
 * @param {Object} selectedItem - выбранный элемент
 */

/**
 * @callback formSaveCallback
 * @param {Object} model - модель формы
 * @param {string} type - тип формы (process/folder)
 */

/**
 * @callback deployedProcessCallback
 * @param {string} procDefId - код задачи
 */

/**
 * @callback deployedDecisionCallback
 * @param {string} decDefId - код задачи
 */

/** События */
export const events = {
  /** События в приложении */
  modeler: {
    /**
     * Экспортировать активную диаграмму
     * @event Modeler#export
     * @param {string} type - тип экспортируемой диаграммы
     */
    export: 'modeler.export',

    /**
     * Отобразить диалог создания новой диаграммы
     * @event Modeler#createDiagram
     */
    createDiagram: 'modeler.create-diagram',

    /**
     * Отобразить диалог выбора элемента из списка
     * @event Modeler#showSelectionGrid
     * @param {string} title - Заголовок диалога
     * @param {Object[]} items - элеиенты для выбора
     * @param {string} items.id - код элемента
     * @param {string} items.name - название элемента
     * @param {Object} selectedItem - выбранный элемент
     * @param {itemSelectedCallback} callback - коллбек, вызываемый при выборе элемента
     */
    showSelectionGrid: 'modeler.show-selection-grid',

    /**
     * Отобразить форму корректировки элемента
     * @event Modeler#showForm
     * @param {string} mode - режим формы (create/edit/delete/copy)
     * @param {string} type - тип элемента (process/folder)
     * @param {Object} model - элемент
     * @param {formSaveCallback} callback - коллбек, вызываемый при нажатии на кнопку "сохранить"
     */
    showForm: 'modeler.show-form',

    /**
     * Отобразить диалог с настройками общего доступа
     * @event Modeler#showAccessDialog
     * @param {string} recordId - код диаграммы, для которой необходимо отобразить диалог с настройками общего доступа
     * 
     */
    showAccessDialog: 'modeler.show-access-dialog'
  },
  /** События в панели свойств */
  propertiesPanel: {
    /**
     * Отобразить диалог выбора формы formio
     * @event PropertiesPanel#selectForm
     * @param {string} unformio - код выбранной формы
     * @param {formioCallback} - коллбек, вызываемый после выбора формы
     */
    selectForm: 'properties-panel.select-form',

    /**
     * Отобразить диалог выбора действия
     * @event PropertiesPanel#selectAction
     * @param {string} actionId - код выбранного действия
     * @param {ActionDefinitionType} type - тип задачи
     * @param {actionCallback} callback - коллбек, вызываемый после выбора действия
     */
    selectAction: 'properties-panel.select-action',

    /**
     * Отобразить диалог ввода параметров задачи
     * @event PropertiesPanel#setServiceTaskParameters
     * @param {string} actionId - код действия
     * @param {ServiceTaskParameter[]} parameters - сохраненные параметры
     * @param {setParametersCallback} callback - коллбек, вызываемый после ввода значений параметров
     */
    setServiceTaskProperties: 'properties-panel.set-service-task-parameters',

    /** 
     * Отобразить диалог выбора опубликованных процессов
     * @event PropertiesPanel#selectDeployedProcess
     * @param {string} procDefKey - ключ опубликованного процесса
     * @param {deployedProcessCallback} callback - коллбек, вызываемый после выбора действия
     */
    selectDeployedProcess: 'properties-panel.select-deployed-process',

    /** 
     * Отобразить диалог выбора опубликованных dmn решений
     * @event PropertiesPanel#selectDeployedProcess
     * @param {string} decDefKey - ключ опубликованного dmn решения
     * @param {deployedDecisionCallback} callback - коллбек, вызываемый после выбора dmn решения
     */
    selectDeployedDecision: 'properties-panel.select-deployed-decision',
  },
  /** События formio */
  formio: {
    /**
     * Отобразить диалог с формой formio
     * @event Formio#showForm
     * @param {string} code - код формы
     * @param {Object} definition - определение формы
     * @param {submitFormioCallback} callback - коллбек, вызываемый при нажатие на кнопку submit
     */
    showForm: 'formio.show-form',

    /**
     * Отобразить диалог создания формы formio
     * @event Formio#createForm
     * @param {formioCallback} callback - коллбек, вызываемый при успешном создании формы
     * @param {boolean} isSystem - признак системности формы
     */
    createForm: 'formio.create-form',

    /**
     * Отобразить диалог корректировки формы formio
     * @event Formio#editForm
     * @param {string} unformio - код формы, которую нужно отредактировать
     */
    editForm: 'formio.edit-form'
  }
}