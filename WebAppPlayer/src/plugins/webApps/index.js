/**
 * Модуль работы с конструктором веб приложений
 */

import { WebApps } from './webApps'
import Authentication from '@it-enterprise/authentication'
import GrapgQlCore from '@it-enterprise/graphql'
import ModulesManager from '@it-enterprise/modules-manager'
import Router from '../router/index'
import storeModule from './store/index'

import axios from 'axios'

const _namespace = 'WebApps'

export default {
  install(Vue, params) {
    let { options, dependencies } = params || {}

    if (!dependencies) {
      throw new Error('Зависимости должны быть переданы')
    }

    if (!dependencies.axios) {
      dependencies.axios = axios
    }

    // регистрируем модуль хранилища
    let store = dependencies.store
    if(!store){
      throw new Error('Хранилище должно быть передано в виде зависимости .store')
    }
    store.registerModule(_namespace, storeModule)


    // подключаем основные системные плагины
    Vue.use(ModulesManager, { dependencies })
    Vue.use(GrapgQlCore, { options, dependencies })
    Vue.use(Authentication, { options, dependencies })
    Vue.use(Router, { options, dependencies })

    const core = new WebApps(dependencies)
    dependencies.modulesManager.register(_namespace, () => Promise.resolve(core))
    Vue.prototype.$WebApps = core
  }
}


