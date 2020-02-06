// @it-enterprise пакеты
import WebApps from '@it-enterprise/webappscore'
import Localization from '@it-enterprise/localization'
import GrapgQlCore from '@it-enterprise/graphql'
import Router from '@it-enterprise/routercore'
import auth from '@it-enterprise/jwtauthentication'


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
import { onError } from 'apollo-link-error'
import VueApollo from 'vue-apollo'

import { routerDependencies } from './router'
const config = window.config

auth.config(config.GrapgQlUrl)

import signalR from './signalR'
import './registerServiceWorker'

const cache = new InMemoryCache()

const httpLink = new HttpLink({
  uri: config.GrapgQlUrl + 'api/graphql',
})

const authLink = setContext(async function (_, { headers }) {
  const token = await auth.getToken()
  const authHeader = { Authorization: `Bearer ${token}` }
  return {
    headers: {
      ...headers,
      ...authHeader,
      schema: 'eamschema'
    }
  }
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  debugger
  console.log(graphQLErrors.message)
  console.log(networkError)
  if (networkError && networkError.statusCode === 401) {
    auth.clearTokens()
    //routerDependencies.router.push({ name: 'EAMLOGIN' })
    routerDependencies.router.push('login')
  }
  if (graphQLErrors) {
    return graphQLErrors.message
  }
})

const apolloClient = new ApolloClient({
  link: errorLink.concat(authLink.concat(httpLink)),
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
Vue.use(GrapgQlCore, { options: config, dependencies })
Vue.use(Localization, { dependencies })
Vue.use(WebApps, { options: config, dependencies }, () => auth.getToken())
Vue.use(Router, { options: config, dependencies }, () => auth.getToken())

Vue.prototype.$localization.RegisterLanguage('test', 'en', () => import('./plugins/resources/en.json'))

// Шина событий
export const eventBus = new Vue({ store })

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



