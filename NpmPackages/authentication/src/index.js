import path from 'path'
import Authentication from './authentication'
import storeModule from './store/index'

let Vue = undefined

export default {
  install(vue, params) {
    let { dependencies } = params || {}
    Vue = vue

    if (!dependencies) {
      throw new Error('Зависимости должны быть переданы!')
    }

    // регистрируем модуль хранилища
    let store = dependencies.store
    if (!store) {
      throw new Error('Хранилище должно быть передано в виде зависимости .store')
    }
    store.registerModule(storeModule.namespace, storeModule)

    // регистрация компонентов
    registerComponents(require.context('./components/renderless', false, /\.vue$|.js$/), 'rs')
    registerComponents(require.context('./components/views', false, /\.vue$|.js$/), '')

    loadLocalizations()

    let authentication = new Authentication(Vue, dependencies)
    Vue.prototype.$authentication = authentication
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
    Vue.prototype.$localization.RegisterLanguage('eds', name, () => Promise.resolve(context(key)))
  })

}


/**
 *  Регистрация компонентов
 */
function registerComponents(context) {
  context.keys().forEach(function (key) {
    var name = path.basename(key)
    name = name.substring(0,name.lastIndexOf('.'))
    Vue.component(`${name}`, context(key).default)
  })
}