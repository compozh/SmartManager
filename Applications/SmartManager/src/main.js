// service-worker
import './registerServiceWorker'

// @it-enterprise пакеты
import Localization from '@it-enterprise/localization'
import GraphQlCore from '@it-enterprise/graphql'
import ItCommon from '@it-enterprise/common'
import formio from '@it-enterprise/formio'
import '@it-enterprise/formio/dist/formio.css'

// Authentication
import auth from '@/utils/auth'

// vue пакеты
import Vue from 'vue'
import App from './App.vue'

// Vuesax Component Framework
import Vuesax from 'vuesax'
import 'material-icons/iconfont/material-icons.css' //Material Icons
import 'vuesax/dist/vuesax.css' // Vuesax

Vue.use(Vuesax)

import Vuex from 'vuex'

// axios
import axios from 'axios'

// Theme Configurations
import '@/themeConfig.js'

// Globally Registered Components
import '@/utils/globalComponents.js'

// Styles: SCSS
import '@/assets/scss/main.scss'

// Tailwind
import '@/assets/css/main.css'

// Vue Router
import router from './router'

// Vuex Store
import store from './store'

// i18n
import { i18n } from './i18n/i18n'

// Vuesax Admin Filters
import '@/utils/filters'

// VeeValidate
import VeeValidate from 'vee-validate'
Vue.use(VeeValidate)

// Vuejs - Vue wrapper for hammerjs
import { VueHammer } from 'vue2-hammer'
Vue.use(VueHammer)

// Feather font icon
require('./assets/css/iconfont.css')
Vue.config.productionTip = false

// apollo
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'

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
  ...router
}

// Плагины стандартные
Vue.use(Vuex)
Vue.use(VueApollo)

// Плагины it-enterprise
Vue.use(ItCommon)
Vue.use(GraphQlCore, { options: window.appConfig, dependencies })
Vue.use(Localization, { dependencies })

Vue.prototype.$localization.RegisterLanguage('', 'ru', () => import('./i18n/resources/ru.json'))
Vue.prototype.$localization.RegisterLanguage('', 'en', () => import('./i18n/resources/en.json'))
Vue.prototype.$localization.RegisterLanguage('', 'uk', () => import('./i18n/resources/uk.json'))

const formioOptions = {
  auth,
  WsUrl: window.appConfig.WsUrl,
  routerDependencies: () => ({ router }),
  GraphQlUrl: window.appConfig.GrapgQlUrl
}
Vue.use(formio, { options: formioOptions, dependencies })

export const eventBus = new Vue()

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
