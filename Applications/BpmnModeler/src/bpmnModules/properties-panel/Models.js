/**
 * Вкладка панели свойств
 */
export class PropertiesPanelTab {
  /**
   * Создать вкладку
   * @param {String} key - Идентификатор вкладки
   * @param {String} title - Заголовок вкладки
   * @param {PropertiesPanelGroup[]} groups - Группы вкладки
   */
  constructor(key, title, groups) {
    this.key = key;
    this.title = title;
    this.groups = groups;
  }
}

/**
 * Группа панели свойств
 */
export class PropertiesPanelGroup {
  /**
   * Создать группу
   * @param {String} key - идентификатор группы
   * @param {String} title - заголовок группы
   * @param {PropertiesPanelEntry[]} entries - дочерние элементы
   */
  constructor(key, title, entries) {
    this._key = key;
    this._title = title;
    this._entries = entries;
  }

  get key() {
    return this._key;
  }

  get title() {
    return this._title;
  }

  get entries() {
    return this._entries;
  }
}

/**
 * @callback createChilrenCallback
 * @param {Function} createElement - Функция создания элемента
 * @returns {Array|string} Дочерние элементы
 */

/**
 * Элемент панели свойсв
 */
export class PropertiesPanelEntry {
  /**
   * Создать элемент
   * @param {String} type - тип элемента
   * @param {Object} data - данные элемента
   * @param {createChilrenCallback} children - коллбек, вызываемый для создания дочерних элементов
   */
  constructor(type, data, children) {
    this._type = type;
    this._data = data;
    this._children = children;
  }

  get type() {
    return this._type;
  }

  get data() {
    return this._data;
  }

  /**
   * Создать дочерние элементы
   * @param {Function} createElement - функция для создания элемента
   * @returns {PropertiesPanelEntry[]} Дочерние элементы
   */
  children(createElement) {
    return this._children ? this._children(createElement) : null;
  }
}