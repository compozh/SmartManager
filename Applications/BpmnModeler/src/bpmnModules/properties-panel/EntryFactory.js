import { PropertiesPanelEntry } from './Models';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import * as cmdHelper from './bpmn/helpers/CmdHelper';
import elementHelper from './bpmn/helpers/ElementHelper';
import { nextId } from './utils';
import { debounce } from 'min-dash';
import { concatCommands } from './utils';

/**
 * Фабрика элементов для панели свойств
 */
export default class EntryFactory {

  /**
   * Создать экзмемпляр панели свойств
   * @param {Object} element - Выбранный элемент
   * @param {Object} commandStack - Стек комманд
   * @param {Object} bpmnFactory - Фабрика bpmn элементов
   * @param {Boolean} readonly - Режим для чтения
   */
  constructor(element, commandStack, bpmnFactory, readonly) {
    this.element = element;
    this.commandStack = commandStack;
    this.bpmnFactory = bpmnFactory;
    this.readonly = readonly;
  }

  /**
   * Создать описание текстового поля
   * @param {EntryOptions} options - Параметры текстового поля
   * @returns {PropertiesPanelEntry} Описание текстового поля
   */
  textField(options) {
    const data = this.getDefaultData(options);
    data.on.input = debounce(data.on.input, 800);
    if (options.type) {
      data.props.type = options.type;
    }
    return new PropertiesPanelEntry('v-text-field', data);
  }

  /**
   * Создать описание многострочного текстового поля
   * @param {TextAreaOptions} options - Параметры многострочного текстового поля
   * @returns {PropertiesPanelEntry} Описание многострочного текстового поля
   */
  textArea(options) {
    const data = this.getDefaultData(options);
    data.props.rows = typeof options.rows === 'number' ? options.rows : 1;
    data.props['auto-grow'] = true;
    data.on.input = debounce(data.on.input, 800);
    return new PropertiesPanelEntry('v-textarea', data);
  }

  /**
   * Создать описание текстового редактора
   * @param {EntryOptions} options - Параметры текстового редактора
   * @returns {PropertiesPanelEntry} Описание текстового редактора
   */
  richEdit(options) {
    const data = this.getDefaultData(options);
    data.on.input = debounce(data.on.input, 800);
    return new PropertiesPanelEntry('properties-panel-rich-edit', data);
  }

  /**
   * Создать описание переключателя
   * @param {EntryOptions} options - Параметры переключателя
   * @returns {PropertiesPanelEntry} Описание переключателя
   */
  checkbox(options) {
    var data = this.getDefaultData(options);
    data.on.change = data.on.input;
    delete data.on.input;
    data.props['input-value'] = data.props.value;
    delete data.props.value;
    return new PropertiesPanelEntry('v-checkbox', data);
  }

  /**
   * Создать описание автодополняемого поля
   * @param {AutoCompleteBoxOptions} options - Параметры автодополняемого поля
   * @returns {PropertiesPanelEntry} Описание автодополняемого поля
   */
  autocompleteBox(options) {
    var data = this.getDefaultData(options);
    data.props.loadItems = options.loadItems;
    data.props.prependIcon = options.prependIcon;
    data.props.appendIcon = options.appendIcon;
    if (!this.readonly && options.prepend) {
      data.on.prepend = options.prepend;
    }
    if (!this.readonly && options.append) {
      data.on.append = options.append;
    }
    
    return new PropertiesPanelEntry('properties-panel-autocompletebox', data);
  }

  /**
   * Создать описание поля с выпадающим списком
   * @param {SelectBoxOptions} options - Параметры поля с выпадающим списком
   * @returns {PropertiesPanelEntry} Описание поля с пыпадающим списком
   */
  selectBox(options) {
    var data = this.getDefaultData(options);
    data.props['item-text'] = 'name';
    data.props.items = options.items;
    return new PropertiesPanelEntry('v-select', data);
  }

  /**
   * Создать описание кнопки
   * @param {ButtonOptions} options - Параметры кнопки
   * @returns {PropertiesPanelEntry} Описание кнопки
   */
  button(options) {
    return new PropertiesPanelEntry('v-btn', {
      props: {
        key: options.id,
        disabled: this.readonly || (options.disabled ? options.disabled(this.element) : false),
        block: true
      },
      on: {
        click: () => options.click ? options.click(this.element) : null
      },
      style: getDefaultStyle(options)
    }, () => options.label);
  }

  /**
   * Создать описание поля "Элементы расширения"
   * @param {ExtensionElementsOptions} options - параметы поля
   * @returns Описание поля "Элементы расширения"
   */
  extensionElements(options) {
    var data = {
      props: {
        key: options.id,
        label: options.label,
        readonly: this.readonly,
        element: this.element,
        getExtensionElements: options.getExtensionElements,
        createExtensionElement: () => {
          var commands = [],
            bo = getBusinessObject(this.element),
            extensionElements = bo.get('extensionElements');
          if (!extensionElements) {
            extensionElements = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, this.bpmnFactory);
            commands.push(cmdHelper.updateBusinessObject(this.element, bo, { extensionElements: extensionElements }));
          }
          commands.push(options.createExtensionElement(extensionElements, generateElementId(options.prefix)));
          this.execute(commands.flat());
        },
        removeExtensionElement: (element) => {
          this.execute(options.removeExtensionElement(element));
        },
        resetOnElementChanged: true
      },
      style: getDefaultStyle(options)
    };
    if (options.onActiveElementChanged) {
      data.props.onActiveElementChanged = options.onActiveElementChanged;
    }
    return new PropertiesPanelEntry('properties-panel-extension-elements', data);
  }

  /**
   * Создать описание поля выбора даты
   * @param {EntryOptions} options - Параметры поля выбора даты
   * @returns Описание поля выбора даты
   */
  datePicker(options) {
    return new PropertiesPanelEntry('properties-panel-date-picker-field', this.getDefaultData(options));
  }

  /**
   * Создать описание текстовой метки
   * @param {LabelOptions} options - Параметры текстовой метки
   * @returns Описание текстовой метки
   */
  label(options) {
    return new PropertiesPanelEntry('p', {
      props: {
        key: options.id
      },
      class: {
        'properties-panel-label': true
      },
      style: getDefaultStyle(options)
    }, () => options.value);
  }

  getDefaultData(options) {
    console.log(this.get(options));
    return {
      props: {
        key: options.id,
        label: options.label,
        value: this.get(options),
        rules: this.readonly ? [] : [(value) => this.validate(options, value)],
        readonly: this.readonly,
        clearable: !this.readonly
      },
      on: {
        input: (value) => { if (this.validate(options, value)) { this.set(options, value); } }
      },
      style: getDefaultStyle(options)
    };
  }

  validate(options, value) {
    return options.validate ? options.validate(this.element, value) : true;
  }

  get(options) {
    if (options.get) {
      return options.get(this.element);
    } else {
      return getBusinessObject(this.element).get(options.model);
    }
  }

  set(options, value) {
    if (this.readonly || this.validate(options, value) !== true) {
      return;
    }
    var command;
    if (options.set) {
      command = options.set(this.element, value);
    } else {
      command = cmdHelper.updateProperties(this.element, { [options.model]: value });
    }
    this.execute(command);
  }

  execute(command) {
    if (Array.isArray(command)) {
      command = concatCommands(command);
    }
    try {
      this.commandStack.execute(command.cmd, command.context);
    } catch (error) {
      console.error(error);
    }
  }
}

function generateElementId(prefix) {
  prefix = prefix + '_';
  return nextId(prefix);
}

function getDefaultStyle(options) {
  const visible = typeof options.visible === 'boolean' ? options.visible : true;
  const style = { ...options.style };
  if (!visible) {
    style.display = 'none';
  }
  return style;
}

/**
 * Коллбек для получения свойства модели
 * @callback GetCallback
 * @param {Object} element - Текущий выбранный элемент диаграммы
 * @returns {*} Значение свойства модели
 */

/**
 * Коллбек для установки свойства модели
 * @callback SetCallback
 * @param {Object} element - Текущий выбранный элемент диаграммы
 * @param {*} value - Новое значение свойства
 */

/**
 * Коллбек для установки свойства модели
 * @callback ValidateCallback
 * @param {Object} element - Текущий выбранный элемент диаграммы
 * @param {*} value - Новое значение свойства
 * @returns {boolean} Валидное ли новое значение
 */

/**
 * Коллбек для получения свойсва модели
 * @callback ClickCallback
 * @param {Object} element - Текущий выбранный элемент диаграммы
 */

/**
 * Коллбек для получения свойсва модели
 * @callback DisabledCallback
 * @param {Object} element - Текущий выбранный элемент диаграммы
 * @returns {boolean} Валидное ли новое значение
 */

export class EntryOptions {
  /**
   * Создать описание элемента панели свойств
   * @param {string} id - Идентификатор
   * @param {string} label - Метка
   * @param {string} model - Свойство модели
   * @param {GetCallback} [get] - Функция получения значения
   * @param {SetCallback} [set] - Функция установки значения
   * @param {ValidateCallback} [validate] - Функция валидации
   */
  constructor(id, label, model, get, set, validate) {
    this.id = id;
    this.label = label;
    this.model = model;
    this.get = get;
    this.set = set;
    this.validate = validate;
  }
}

export class TextAreaOptions extends EntryOptions {
  /**
   * Создать описание многострочного текстового поля
   * @param {string} id - Идентификатор
   * @param {string} label - Метка
   * @param {string} model - Свойство модели
   * @param {GetCallback} [get] - Функция получения значения
   * @param {SetCallback} [set] - Функция установки значения
   * @param {ValidateCallback} [validate] - Функция валидации
   * @param {number} [rows] - Колличество строк в поле по умолчанию
   */
  constructor(id, label, model, get, set, validate, rows) {
    if (!rows) {
      rows = 1;
    }
    super(id, label, model, get, set, validate);
    this.rows = rows;
  }
}

export class AutoCompleteBoxOptions extends EntryOptions {
  /**
   * Создать описание автодополняемого поля
   * @param {string} id - Идентификатор
   * @param {string} label - Метка
   * @param {string} model - Свойство модели
   * @param {Promise} loadItems - Операция загрузки элементов
   * @param {GetCallback} [get] - Функция получения значения
   * @param {SetCallback} [set] - Функция установки значения
   * @param {ValidateCallback} [validate] - Функция валидации
   * @param {string} [prependIcon] - Имя иконки перед полем
   * @param {string} [appendIcon] - Имя иконки после поля
   * @param {ClickCallback} [prepend] - Функция, вызываемая при нажатии иконку перед полем
   * @param {ClickCallback} [append] - Функция, вызываемая при нажатии иконку после поля
   */
  constructor(id, label, model, get, set, validate, loadItems, prependIcon, appendIcon, prepend, append) {
    super(id, label, model, get, set, validate);
    this.loadItems = loadItems;
    this.prependIcon = prependIcon;
    this.appendIcon = appendIcon;
    this.prepend = prepend;
    this.append = append;
  }
}

export class SelectBoxOptions extends EntryOptions {
  /**
   * Создать описание поля с выпадающим списком
   * @param {string} id - Идентификатор
   * @param {string} label - Метка
   * @param {string} model - Свойство модели
   * @param {Object[]} items - Элементы выпадающего поля
   * @param {string|number} items[].value - Значение элемента выпадающего поля
   * @param {string} items[].name - Название элемента выпадающего поля
   * @param {GetCallback} [get] - Функция получения значения
   * @param {SetCallback} [set] - Функция установки значения
   * @param {ValidateCallback} [validate] - Функция валидации
   */
  constructor(id, label, model, get, set, validate, items) {
    super(id, label, model, get, set, validate);
    this.items = items;
  }
}

export class ButtonOptions {
  /**
   * Создать описание кнопки
   * @param {string} id - Иденификатор
   * @param {string} label - Метка
   * @param {DisabledCallback} disabled - Доступно ли нажатие на кнопку
   * @param {ClickCallback} click - Функция, вызываемая при нажатии на кнопку
   */
  constructor(id, label, disabled, click) {
    this.id = id;
    this.label = label;
    this.disabled = disabled;
    this.click = click;
  }
}

export class ExtensionElementsOptions {
  /**
   * Создать описание поля "Элементы расширения"
   * @param {string} id - Идентификатор
   * @param {string} label - Метка
   * @param {string} prefix - Префикс идентификаторов дочерних элементов
   * @param {Function} getExtensionElements - Функция, возвращающая список элементов расширения
   * @param {Function} addExtensionElement - Функция, добавляющая новый элемент
   * @param {Function} removeExtensionElement - Функция, удаляющая указанный элемент
   * @param {Function} onActiveElementChanged - Функция, вызываемая при смене выбранного элемента
   */
  constructor(id, label, prefix, getExtensionElements, addExtensionElement, removeExtensionElement, onActiveElementChanged) {
    this.id = id;
    this.label = label;
    this.prefix = prefix;
    this.getExtensionElements = getExtensionElements;
    this.addExtensionElement = addExtensionElement;
    this.removeExtensionElement = removeExtensionElement;
    this.onActiveElementChanged = onActiveElementChanged;
  }
}

export class LabelOptions {
  /**
   * Создать описание текстовой метки
   * @param {string} id 
   * @param {string} value 
   * @param {boolean} visible 
   * @param {Object} style 
   */
  constructor(id, value, visible, style) {
    this.id = id;
    this.value = value;
    this.visible = visible;
    this.style = style;
  }
}