import Vue from 'vue'
import Vuex from 'vuex'

import router from './router'
import Localization from '@it-enterprise/localization'
import formio from '@it-enterprise/formio'
import '@it-enterprise/formio/dist/formio.css'
import GrapgQlCore from '@it-enterprise/graphql'
import axios from 'axios'
import store from './store/index'
import { i18n } from './plugins/i18n'

import vuetify from './plugins/vuetify'

import 'roboto-fontface/css/roboto/roboto-fontface.css'
import App from './App.vue'

// apollo
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'

import auth from '@it-enterprise/jwtauthentication'
auth.config({
  baseUrl: window.myConfig.GrapgQlUrl,
  onError: error => {
    if (error.response && error.response.status === 400) {
      store.dispatch('logout')
    }
  }
})

Vue.config.productionTip = false

const apolloProvider = new VueApollo({
  defaultClient: new ApolloClient({
    link: new HttpLink({}),
    cache: new InMemoryCache(),
    connectToDevTools: true
  })
})

let dependencies = {
  router,
  store,
  i18n,
  apolloProvider,
  axios
}

Vue.use(Vuex)
Vue.use(GrapgQlCore, { options: window.myConfig, dependencies })
Vue.use(Localization, { dependencies })

var formioOptions = {
  auth,
  WsUrl: window.myConfig.WsUrl,
  GraphQlUrl: window.myConfig.GrapgQlUrl,
  onError: ({ message, networkError }) => {
    console.log(message)
  }
}

Vue.use(formio, { options: formioOptions, dependencies })

Vue.prototype.$localization.RegisterLanguage('processes', 'en', () => import('./plugins/resources/en.json'))
Vue.prototype.$localization.RegisterLanguage('processes', 'ru', () => import('./plugins/resources/ru.json'))
Vue.prototype.$localization.RegisterLanguage('processes', 'uk', () => import('./plugins/resources/uk.json'))

const req = require.context('@/components/', true, /\.(js|vue)$/i)
req.keys().map(key => {
  if (!(req(key).default || {}).name) {
    return
  }
  Vue.component(req(key).default.name, req(key).default)
})

export const eventBus = new Vue({
  router,
  vuetify,
  store,
  i18n,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
