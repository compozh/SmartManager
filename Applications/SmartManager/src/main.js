// service-worker
import './registerServiceWorker'

// @it-enterprise пакеты
import Localization from '@it-enterprise/localization'
import GrapgQlCore from '@it-enterprise/graphql'
import ItCommon from '@it-enterprise/common'
import auth from '@it-enterprise/jwtauthentication'
auth.config(window.appConfig.GrapgQlUrl)

// vue пакеты
import Vue from 'vue'
import App from './App.vue'

// Vuesax Component Framework
import Vuesax from 'vuesax'
import 'material-icons/iconfont/material-icons.css' //Material Icons
import 'vuesax/dist/vuesax.css' // Vuesax

Vue.use(Vuesax)

import Vuex from 'vuex'

// Flag icons
import FlagIcon from 'vue-flag-icon'
Vue.use(FlagIcon)

// axios
import axios from 'axios'

Vue.prototype.$http = axios

// Theme Configurations
import '../themeConfig.js'

// ACL
import acl from './acl/acl'

// Globally Registered Components
import './globalComponents.js'

// Styles: SCSS
import './assets/scss/main.scss'

// Tailwind
import '@/assets/css/main.css'

// Vue Router
import router from './router'

// Vuex Store
import store from './store/index'

// i18n
import { i18n } from './i18n/i18n'

// Vuesax Admin Filters
import './filters/filters'

// Clipboard
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

// Tour
import VueTour from 'vue-tour'
Vue.use(VueTour)
require('vue-tour/dist/vue-tour.css')

// VeeValidate
import VeeValidate from 'vee-validate'
Vue.use(VeeValidate)

// Vuejs - Vue wrapper for hammerjs
import { VueHammer } from 'vue2-hammer'
Vue.use(VueHammer)

// PrismJS
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'

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
Vue.use(GrapgQlCore, { options: window.appConfig, dependencies })
Vue.use(Localization, { dependencies })

Vue.prototype.$localization.RegisterLanguage('', 'ru', () => import('./i18n/resources/ru.json'))
Vue.prototype.$localization.RegisterLanguage('', 'en', () => import('./i18n/resources/en.json'))
Vue.prototype.$localization.RegisterLanguage('', 'uk', () => import('./i18n/resources/uk.json'))



export const eventBus = new Vue()

new Vue({
  router,
  store,
  i18n,
  acl,
  render: h => h(App)
}).$mount('#app')
