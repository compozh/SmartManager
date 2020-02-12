// @it-enterprise пакеты
import Localization from '@it-enterprise/localization'
import GrapgQlCore from '@it-enterprise/graphql'
import ItCommon from '@it-enterprise/common'
import '@it-enterprise/common/dist/common-components.css'
import formio from '@it-enterprise/formio'
import '@it-enterprise/formio/dist/formio.css'

import auth from '@it-enterprise/jwtauthentication'

// vue пакеты
import Vue from 'vue'
import Vuex from 'vuex'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import acl from './acl/acl'
import { i18n } from './plugins/i18n'
import VueI18n from 'vue-i18n'
import store from './store/index'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import App from './App.vue'

// apollo
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import VueCookies from 'vue-cookies'

import router from './router'

import signalR from './signalR'
import BarcodeScaner from './components/components/BarcodeScaner'

auth.config({
  baseUrl: window.myConfig.GrapgQlUrl,
  onError: error => {
    if(error.response && error.response.status == 400) {
      store.dispatch('auth/logout')
    }
  }
})


const apolloProvider = new VueApollo({
  defaultClient: new ApolloClient({
    link: new HttpLink({}),
    cache: new InMemoryCache(),
    connectToDevTools: true,
  })
})

// объект с зависимостями
let dependencies = {
  store,
  i18n,
  apolloProvider,
  axios,
  router
}

// Плагины стандартные
Vue.use(Vuex)
Vue.use(VueI18n)
Vue.use(VueApollo)
Vue.use(VueCookies)
Vue.use(signalR)

// Плагины it-enterprise
Vue.use(ItCommon)
Vue.use(GrapgQlCore, { options: window.myConfig, dependencies })
Vue.use(Localization, { dependencies })

var formioOptions = {
  auth,
  GraphQlUrl: window.myConfig.GrapgQlUrl,
  routerDependencies: () => router,
  onError: ({ message, networkError }) => {
    if (networkError) {
      switch(networkError.statusCode) {
        case 401:
        case 400:
          store.dispatch('auth/logout')
          break;
      }
    }
    console.log(message)
  }
}

Vue.use(formio, { options: formioOptions, dependencies })

Vue.prototype.$localization.RegisterLanguage('mes', 'en', () => import('./plugins/resources/en.json'))
Vue.prototype.$localization.RegisterLanguage('mes', 'ru', () => import('./plugins/resources/ru.json'))
Vue.prototype.$localization.RegisterLanguage('mes', 'uk', () => import('./plugins/resources/uk.json'))

// Шина событий
export const eventBus = new Vue({
  router,
  vuetify,
  store,
  i18n,
  apolloProvider,
  acl,
  render: h => h(App)
}).$mount('#app')

var barcodeScaner = new BarcodeScaner()
barcodeScaner.initialize()

// импорт компонентов
let req = require.context('@/components/', false, /\.(js|vue)$/i)
req.keys().map(key => {
  if (!(req(key).default || {}).name) {
    return
  }
  Vue.component(req(key).default.name, req(key).default)
})
req = require.context('@/components/components', true, /\.(js|vue)$/i)
req.keys().map(key => {
  if (!(req(key).default || {}).name) {
    return
  }
  Vue.component(req(key).default.name, req(key).default)
})
req = require.context('@/components/layouts', true, /\.(js|vue)$/i)
req.keys().map(key => {
  if (!(req(key).default || {}).name) {
    return
  }
  Vue.component(req(key).default.name, req(key).default)
})
req = require.context('@/components/toolbars', false, /\.(js|vue)$/i)
req.keys().map(key => {
  if (!(req(key).default || {}).name) {
    return
  }
  Vue.component(req(key).default.name, req(key).default)
})
