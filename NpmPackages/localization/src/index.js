import path from 'path'
import Localization from './localization.js'
const loadModule = () => import('./interface')

const _namespace = 'Localization'


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


    /** Регистрация асинхронных компонент без импорта */
    const registerComponents = function (context, set, prefix) {
      context.keys().forEach(function (key) {

        var name = path.basename(key)
        name = name.substring(0,name.lastIndexOf('.'))
        Vue.component(`${_namespace}-${prefix}-${name}`, () => loadModule().then(r => r.__private.components[set][key] ))
      })
    }
    registerComponents(require.context('./components/renderless', false, /\.vue$|.js$/, 'weak'), 'renderless', 'rs')
    registerComponents(require.context('./components/views', false, /\.vue$|.js$/, 'weak'), 'views', 'view')


    // регистрация модуля
    const localization = new Localization(dependencies)
    dependencies.modulesManager.register(_namespace, () => Promise.resolve(localization))


    Object.defineProperty(Vue.prototype, '$localization', {
      get(){
        return localization
      }
    })

  }
}

