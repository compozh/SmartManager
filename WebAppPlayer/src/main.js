import Vue from 'vue'
import Vuetify from 'vuetify'
import WebApps from '@it-enterprise/webAppsCore'
import Localization from '@it-enterprise/localization'
import Eds from '@it-enterprise/eds'

import { i18n } from './plugins/i18n'
import VueI18n from 'vue-i18n'
import 'vuetify/dist/vuetify.min.css'
import Vuex from 'vuex'
import store from './store/index'
export const eventBus = new Vue() // Шина событий

Vue.use(Vuetify)
Vue.use(Vuex)
Vue.use(VueI18n)

// Create a new store
//const store = new Vuex.Store({})


// объект с зависимостями
let dependencies = {
  store,
  i18n
}
Vue.use(Eds, {dependencies})

Vue.use(WebApps, {
  dependencies,
  options: window.myConfig
})
Vue.use(Localization, { dependencies })

dependencies.modulesManager.getLocalization().then(resp=>{
  resp.RegisterLanguage('test', 'en', () => import('./plugins/resources/en.json'))
})

// временный импорт компонентов
const req = require.context('@/components/', true, /\.(js|vue)$/i)
req.keys().map(key => {
  if (!(req(key).default || {}).name) {
    return
  }
  Vue.component(req(key).default.name, req(key).default)
})

start()

async function start()   {
  // Загрузка приложения
  let webAppsCore = await dependencies.modulesManager.getWebApps()

  let appComponent = await webAppsCore.GetApplicationComponent({

    properties: {
      i18n,
      store
    }
  })

  new Vue(appComponent).$mount('#app')
}
