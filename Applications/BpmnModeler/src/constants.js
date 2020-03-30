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
 * @param {string} procDefId - код процесса
 */

/**
 * @callback deployedDecisionCallback
 * @param {string} decDefId - код таблицы решений
 */

/**
 * @callback deployedCaseCallback
 * @param {string} caseDefId - код кейса
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
    showAccessDialog: 'modeler.show-access-dialog',

    /**
     * Отобразить диалог с полем введения названия версии
     * @event Modeler#showCreateVersionDialog
     * @param {Object} item - обьэкт текущей версии
     *
     */
    showCreateVersionDialog: 'modeler.show-create-version-dialog'
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
     * @param {string} procDefKey - ключ уже выбранного опубликованного процесса
     * @param {deployedProcessCallback} callback - коллбек, вызываемый после выбора действия
     */
    selectDeployedProcess: 'properties-panel.select-deployed-process',

    /**
     * Отобразить диалог выбора опубликованных таблиц решений
     * @event PropertiesPanel#selectDeployedDecision
     * @param {string} decDefKey - ключ уже выбранного опубликованного dmn решения
     * @param {deployedDecisionCallback} callback - коллбек, вызываемый после выбора таблицы решений
     */
    selectDeployedDecision: 'properties-panel.select-deployed-decision',

    /**
     * Отобразить диалог выбора опубликованных кейсов
     * @event PropertiesPanel#selectDeployedCase
     * @param {string} caseDefKey - ключ уже выбранного опубликованного кейса
     * @param {deployedCaseCallback} callback - коллбек, вызываемый после выбора кейса
     */
    selectDeployedCase: 'properties-panel.select-deployed-case',

    /**
     * Отобразить диалог выбора бизнес-обьекта
     * @event PropertiesPanel#selectBusinessObject
     * @param {string} boDefCode - ключ уже выбранного бизнес-обьекта
     * @param {boolean} onlySystem - признак отбора только системных бизнес-обьектов
     * @param {deployedCaseCallback} callback - коллбек, вызываемый после выбора бизнес-обьекта
     */
    selectBusinessObject: 'properties-panel.select-business-object',

    /**
     * Отобразить диалог выбора действия бизнес-обьекта
     * @event PropertiesPanel#selectBusinessObjectAction
     * @param {string} boDefCode - ключ бизнес-обьекта
     * @param {string} actDefCode - ключ уже выбранного действия бизнес-обьекта
     * @param {boolean} onlySystem - признак отбора только системных действий бизнес-обьектов
     * @param {deployedCaseCallback} callback - коллбек, вызываемый после выбора бизнес-обьекта
     */
    selectBusinessObjectAction: 'properties-panel.select-business-objectAction',

    /**
     * Отобразить диалог выбора доступа к бизнес-обьекту
     * @event PropertiesPanel#selectBusinessObjectAccess
     * @param {string} boDefCode - ключ бизнес-обьекта
     * @param {string} actDefCode - ключ уже выбранного доступа к бизнес-обьекту
     * @param {boolean} onlySystem - признак отбора только системных доступов к бизнес-обьекту
     * @param {deployedCaseCallback} callback - коллбек, вызываемый после выбора доступа к бизнес-обьекту
     */
    selectBusinessObjectAccess: 'properties-panel.select-business-objectAccess',

    /**
     * Отобразить диалог ввода параметров задачи
     * @event PropertiesPanel#setBusinessObjectActionProperties
     * @param {string} logicalKey - код действия
     * @param {ServiceTaskParameter[]} parameters - сохраненные параметры
     * @param {setParametersCallback} callback - коллбек, вызываемый после ввода значений параметров
     */
    setBusinessObjectActionProperties: 'properties-panel.set-business-object-task-parameters',
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
     * Отобразить просмотр формы formio
     * @event Formio#showFormOverview
     * @param {string} code - код формы
     * @param {Object} definition - определение формы
     */
    showFormOverview: 'formio.show-form-overview',

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
};
