import path from 'path'

let Vue = undefined

export default {
  install(vue) {
    Vue = vue
    // регистрация компонентов
    registerComponents(require.context('./components/', true, /\.vue$|.js$/))

    loadLocalizations()

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
    Vue.prototype.$localization.RegisterLanguage('common', name, () => Promise.resolve(context(key)))
  })

}


/**
 *  Регистрация компонентов
 */
function registerComponents(context) {
  context.keys().forEach(function (key) {
    var name = path.basename(key)
    if (!context(key).default || !context(key).default.name) {
      return
    }
    name = context(key).default.name
    Vue.component(name, context(key).default)
  })
}
