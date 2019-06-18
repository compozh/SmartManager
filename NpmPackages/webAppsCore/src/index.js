/**
 * Модуль работы с конструктором веб приложений
 */

import path from 'path'
import { WebApps } from './api/webApps'
import Authentication from '@it-enterprise/authentication'
import GrapgQlCore from '@it-enterprise/graphql'
import ModulesManager from '@it-enterprise/modules-manager'
import Router from '@it-enterprise/routerCore'
import storeModule from './store/index'

const loadModule = () => import('./interface')


import axios from 'axios'

const _namespace = 'WebApps'

export default {
  install(Vue, params) {
    let { options, dependencies } = params || {}

    if (!dependencies) {
      throw new Error('Зависимости должны быть переданы')
    }

    // добавляем в зависимости axios, если он не передан
    if (!dependencies.axios) {
      dependencies.axios = axios
    }

    // регистрируем модуль хранилища
    let store = dependencies.store
    if(!store){
      throw new Error('Хранилище должно быть передано в виде зависимости .store')
    }
    store.registerModule(_namespace, storeModule)


    // регистрируем компоненты

    /** Регистрация асинхронных компонент без импорта */
    const registerComponents = function (context, set, prefix) {
      context.keys().forEach(function (key) {

        var name = path.basename(key)
        name = name.substring(0,name.lastIndexOf('.'))
        console.log(`${_namespace}-${prefix}-${name}`);
        Vue.component(`${_namespace}-${prefix}-${name}`, () => loadModule().then(r => r.__private.components[set][key]))
      })
    }
    registerComponents(require.context('./components', false, /\.vue$|.js$/, 'weak'), 'renderless', 'rs')


    // подключаем основные системные плагины
    Vue.use(ModulesManager, { dependencies })
    Vue.use(Router, { options, dependencies })
    Vue.use(Authentication, { options, dependencies })

    Vue.use(GrapgQlCore, { options, dependencies })

    const core = new WebApps(Vue, options, dependencies)
    dependencies.modulesManager.register(_namespace, () => Promise.resolve(core))
    Vue.prototype.$WebApps = core
  }
}


