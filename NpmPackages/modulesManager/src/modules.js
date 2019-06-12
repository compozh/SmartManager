
/**
 * Менеджер подключаемых модулей
 */
export default {

  all: [],
  loaded: [],
  /**
   * Регистрация нового модуля
   * @param {String} name Имя подключаемого модуля
   * @param {Promise} promise Промис
   */
  register(name, promise) {
    this.all.push(name)

    name = name[0].toUpperCase() + name.substring(1)

    let funcName = `get${name}`

    if (!this[funcName]) {
      this[funcName] = () => {
        return promise()
      }
    }

  }
}