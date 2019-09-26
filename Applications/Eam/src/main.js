// @it-enterprise пакеты
import WebApps from '@it-enterprise/webappscore'
import Localization from '@it-enterprise/localization'
import GrapgQlCore from '@it-enterprise/graphql'
import Authentication from '@it-enterprise/authentication'
import '@it-enterprise/authentication/dist/authentication.css'
import Router from '@it-enterprise/routercore'
import ItCommon from '@it-enterprise/common'
import '@it-enterprise/common/dist/common-components.css'


// vue пакеты
import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import axios from 'axios'
import { i18n } from './plugins/i18n'
import VueI18n from 'vue-i18n'
import store from './store/index'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import DatetimePicker from 'vuetify-datetime-picker'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'

// apollo
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import VueApollo from 'vue-apollo'

import { routerDependencies } from './router'

import signalR from './signalR'
import './registerServiceWorker'

const cache = new InMemoryCache()

const httpLink = new HttpLink({
  uri: window.myConfig.GrapgQlUrl + 'api/graphql',
})

const authLink = setContext((_, { headers }) => {
  const authHeader = Vue.prototype.$authentication.getAuthHeader()
  return {
    headers: {
      ...headers,
      ...authHeader,
      schema: 'eamschema'
    }
  }
})

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
  connectToDevTools: true
})
const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

// объект с зависимостями
let dependencies = {
  store,
  i18n,
  apolloProvider,
  axios,
  ...routerDependencies
}

// Плагины стандартные
Vue.use(Vuetify)
Vue.use(Vuex)
Vue.use(VueI18n)
Vue.use(VueApollo)
Vue.use(signalR)
Vue.use(DatetimePicker)
Vue.use(Viewer)

// Плагины it-enterprise
Vue.use(ItCommon)
Vue.use(GrapgQlCore, { options: window.myConfig, dependencies })
Vue.use(Localization, { dependencies })
Vue.use(Authentication, { options: window.myConfig, dependencies })
Vue.use(Router, { options: window.myConfig, dependencies })
Vue.use(WebApps, { dependencies, options: window.myConfig })

Vue.prototype.$localization.RegisterLanguage('test', 'en', () => import('./plugins/resources/en.json'))

// Шина событий
export const eventBus = new Vue()

// импорт компонентов
const req = require.context('@/components/', true, /\.(js|vue)$/i)
req.keys().map(key => {
  if (!(req(key).default || {}).name) {
    return
  }
  Vue.component(req(key).default.name, req(key).default)
})

start()

async function start() {
  // Загрузка приложения
  let webAppsCore = await Vue.prototype.$WebApps

  let appComponent = await webAppsCore.GetApplicationComponent({

    properties: {
      i18n,
      store
    }
  })

  new Vue(appComponent).$mount('#app')
}



