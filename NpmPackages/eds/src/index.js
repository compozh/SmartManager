import path from 'path'
const loadModule = () => import('./interface')

const _namespace = 'Eds'
let _dependencies = undefined
export default {

  /**
   *
   * @param {*} Vue
   * @param {*} params.dependencies.modulesManager
   */
  install(Vue, params) {

    let { dependencies } = params || {}

    if (!dependencies) {
      throw new Error('Зависимости должны быть переданы')
    }
    _dependencies = dependencies

    /** Регистрация асинхронных компонент без импорта */
    const registerComponents = function (context, set, prefix) {
      context.keys().forEach(function (key) {

        var name = path.basename(key)
        name = name.substring(0,name.lastIndexOf('.'))
        Vue.component(`${_namespace}-${prefix}-${name}`, () => loadModule().then(r => r.__private.components[set][key]))
      })
    }
    registerComponents(require.context('./components/renderless', false, /\.vue$|.js$/, 'weak'), 'renderless', 'rs')
    registerComponents(require.context('./components/views', false, /\.vue$|.js$/, 'weak'), 'views', 'view')
  }

}

export function onModuleLoaded(){
  _dependencies.modulesManager.getLocalization().then(localization => {
    localization.RegisterLanguage('eds', 'ru', ()=> import('./resources/ru.json'))
    localization.RegisterLanguage('eds', 'uk', ()=> import('./resources/uk.json'))
    localization.RegisterLanguage('eds', 'en', ()=> import('./resources/en.json'))

  })
}

