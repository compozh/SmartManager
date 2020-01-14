// @it-enterprise пакеты
import Localization from '@it-enterprise/localization'
import GrapgQlCore from '@it-enterprise/graphql'
import ItCommon from '@it-enterprise/common'
import '@it-enterprise/common/dist/common-components.css'

import auth from '@it-enterprise/jwtauthentication'
auth.config(window.myConfig.GrapgQlUrl)

// vue пакеты
import 'material-design-icons-iconfont/dist/material-design-icons.css' // mdi icons

import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import axios from 'axios'
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

const apolloProvider = new VueApollo({
  defaultClient: new ApolloClient({
    link: new HttpLink({}),
    cache: new InMemoryCache(),
    connectToDevTools: true,
  }),
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
Vue.use(Vuetify)
Vue.use(Vuex)
Vue.use(VueI18n)
Vue.use(VueApollo)
Vue.use(VueCookies)
Vue.use(signalR)

// Плагины it-enterprise
Vue.use(ItCommon)
Vue.use(GrapgQlCore, { options: window.myConfig, dependencies })
Vue.use(Localization, { dependencies })

Vue.prototype.$localization.RegisterLanguage('mes', 'en', () => import('./plugins/resources/en.json'))
Vue.prototype.$localization.RegisterLanguage('mes', 'ru', () => import('./plugins/resources/ru.json'))
Vue.prototype.$localization.RegisterLanguage('mes', 'uk', () => import('./plugins/resources/uk.json'))




// подключение vuetify

const opts = {
  theme: {
    light: true,
    breakpoint: {
      thresholds: {
        xs: 340,
        sm: 540,
        md: 800,
        lg: 1280,
        xl: 1920,
      },
      scrollBarWidth: 24
    }
  },
  icons: {
    iconfont: 'md',
  }
}
const vuetify = new Vuetify(opts)

// Шина событий
export const eventBus = new Vue({
  router,
  vuetify,
  store,
  i18n,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')

var barcodeScaner = new BarcodeScaner()
  barcodeScaner.initialize()

// импорт компонентов
const req = require.context('@/components/', true, /\.(js|vue)$/i)
req.keys().map(key => {
  if (!(req(key).default || {}).name) {
    return
  }
  Vue.component(req(key).default.name, req(key).default)
})

const reqFormio = require.context('@/formio/', true, /\.(js|vue)$/i)
reqFormio.keys().map(key => {
  if (!(reqFormio(key).default || {}).name) {
    return
  }
  Vue.component(reqFormio(key).default.name, reqFormio(key).default)
})