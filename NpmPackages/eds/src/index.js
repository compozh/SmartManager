import path from 'path'
import ruResources from './resources/ru.json'
import ukResources from './resources/uk.json'
import enResources from './resources/en.json'

let Vue = undefined

const _namespace = 'Eds'

export default {

  /**
   *
   * @param {*} Vue
   * @param {*} params.dependencies.modulesManager
   */
  install(vue, params) {

    Vue = vue

    let { dependencies } = params || {}

    if (!dependencies) {
      throw new Error('Зависимости должны быть переданы')
    }


    registerComponents(require.context('./components/renderless', false, /\.vue$|.js$/), 'renderless', 'rs')
    registerComponents(require.context('./components/views', false, /\.vue$|.js$/), 'views', 'view')

    loadLocalizations()

  }

}

function loadLocalizations(){

  console.log(ruResources)
  Vue.prototype.$localization.RegisterLanguage('eds', 'ru', ()=> Promise.resolve({ default: ruResources }))
  Vue.prototype.$localization.RegisterLanguage('eds', 'uk', ()=> Promise.resolve({ default: ukResources }))
  Vue.prototype.$localization.RegisterLanguage('eds', 'en', ()=> Promise.resolve({ default: enResources }))

}


/** Регистрация компонентов */
function registerComponents(context, set, prefix) {
  context.keys().forEach(function (key) {

    var name = path.basename(key)
    name = name.substring(0,name.lastIndexOf('.'))
    Vue.component(`${_namespace}-${prefix}-${name}`, context(key).default)
  })
}