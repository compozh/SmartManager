import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Localization from '@it-enterprise/localization'
import formio from '@it-enterprise/formio'
import '@it-enterprise/formio/dist/formio.css'
import GrapgQlCore from '@it-enterprise/graphql'
import axios from 'axios'
import store from './store/index'
import { i18n } from './plugins/i18n'
// apollo
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'

import auth from '@it-enterprise/jwtauthentication'
auth.config(window.myConfig.GrapgQlUrl)

Vue.config.productionTip = false

const apolloProvider = new VueApollo({
  defaultClient: new ApolloClient({
    link: new HttpLink({}),
    cache: new InMemoryCache(),
    connectToDevTools: true
  })
})

let dependencies = {
  store,
  i18n,
  apolloProvider,
  axios,
  router
}

Vue.use(GrapgQlCore, { options: window.myConfig, dependencies })
Vue.use(Localization, { dependencies })

var formioOptions = {
  auth,
  GraphQlUrl: window.myConfig.GrapgQlUrl,
  routerDependencies: () => router,
  onError: ({ message, networkError }) => {

  }
}

Vue.use(formio, { options: formioOptions, dependencies })

Vue.prototype.$localization.RegisterLanguage('startprocess', 'en', () => import('./plugins/resources/en.json'))
Vue.prototype.$localization.RegisterLanguage('startprocess', 'ru', () => import('./plugins/resources/ru.json'))
Vue.prototype.$localization.RegisterLanguage('startprocess', 'uk', () => import('./plugins/resources/uk.json'))

const req = require.context('@/components/', true, /\.(js|vue)$/i)
req.keys().map(key => {
  if (!(req(key).default || {}).name) {
    return
  }
  Vue.component(req(key).default.name, req(key).default)
})

new Vue({
  router,
  store,
  i18n,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
