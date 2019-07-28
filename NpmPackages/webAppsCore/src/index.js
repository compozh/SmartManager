/**
 * Модуль работы с конструктором веб приложений
 */

import path from 'path'
import { WebApps } from './api/webApps'
import storeModule from './store/index'

let Vue = undefined

const _namespace = 'WebApps'

export default {
  install(vue, params) {
    let { options, dependencies } = params || {}
    Vue = vue

    if (!dependencies) {
      throw new Error('Зависимости должны быть переданы')
    }

    // регистрируем модуль хранилища
    let store = dependencies.store
    if (!store) {
      throw new Error('Хранилище должно быть передано в виде зависимости .store')
    }
    store.registerModule(_namespace, storeModule)

    // регистрируем компоненты
    registerComponents(require.context('./components', false, /\.vue$|.js$/), 'renderless', 'rs')


    const core = new WebApps(Vue, options, dependencies)
    Vue.prototype.$WebApps = core
  }
}


/**
 * Загрузка локализаций
 */
function loadLocalizations() {

  let context = require.context('./resources', false, /\.json$/)
  context.keys().forEach(function (key) {
    var name = path.basename(key)
    name = name.substring(0,name.lastIndexOf('.'))
    Vue.prototype.$localization.RegisterLanguage('WebApps', name, () => Promise.resolve(context(key)))
  })

}


/**
 *  Регистрация компонентов
 */
function registerComponents(context,set, prefix) {
  context.keys().forEach(function (key) {
    var name = path.basename(key)
    name = name.substring(0,name.lastIndexOf('.'))
    Vue.component(`${_namespace}-${prefix}-${name}`, context(key).default)
  })
}