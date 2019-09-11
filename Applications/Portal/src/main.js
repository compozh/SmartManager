// @it-enterprise пакеты

import Localization from '@it-enterprise/localization'
import Authentication from '@it-enterprise/authentication'


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


// Globally Registered Components
import './globalComponents.js'

// Styles: SCSS
import './assets/scss/main.scss'

// Tailwind
import '@/assets/css/main.css'

// Vue Router
import { getRouter } from './router'

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


// // apollo
import VueApollo from 'vue-apollo'

// moment
Vue.use(require('vue-moment'))


// объект с зависимостями
let dependencies = {
  store,
  i18n,
  axios,
}

// Плагины стандартные
Vue.use(Vuex)
Vue.use(VueApollo)

// Плагины it-enterprise
Vue.use(Localization, { dependencies })
Vue.use(Authentication, { options: window.appConfig, dependencies })

Vue.prototype.$localization.RegisterLanguage('test', 'en', () => import('./i18n/resources/en.json'))
getRouter().then(router => {
  new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
  }).$mount('#app')
})



