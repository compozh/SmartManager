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

// Vuex Store
import store from './store/index'
import router  from './router'

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
import { ValidationProvider, ValidationObserver, configure, extend  } from 'vee-validate/dist/vee-validate'
import veeLocalize_ru from 'vee-validate/dist/locale/ru.json'
import veeLocalize_en from 'vee-validate/dist/locale/en.json'
import veeLocalize_uk from 'vee-validate/dist/locale/uk.json'


// Add the required rule
extend('required',{
  validate: value => !!value,
  computesRequired: true
})
configure({
  defaultMessage: (_, values) => {
    return i18n.t(`validation.${values._rule_}`, values)
  }
})

// Register it globally
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)

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

console.log(router)
// объект с зависимостями
let dependencies = {
  store,
  i18n,
  axios,
  ...router
}

// Плагины стандартные
Vue.use(Vuex)
Vue.use(VueApollo)

// язык
if (!localStorage.getItem('language')) {
  localStorage.setItem('language','uk')
}

// Плагины it-enterprise
Vue.use(Localization, { dependencies })
Vue.use(Authentication, { options: window.appConfig, dependencies })

Vue.prototype.$localization.RegisterLanguage('validation', 'en', () => Promise.resolve({default: veeLocalize_en.messages}))
Vue.prototype.$localization.RegisterLanguage('validation', 'ru', () => Promise.resolve({default: veeLocalize_ru.messages}))
Vue.prototype.$localization.RegisterLanguage('validation', 'uk', () => Promise.resolve({default: veeLocalize_uk.messages}))
Vue.prototype.$localization.RegisterLanguage('', 'en', () => import('./i18n/resources/en.json'))
Vue.prototype.$localization.RegisterLanguage('', 'ru', () => import('./i18n/resources/ru.json'))
Vue.prototype.$localization.RegisterLanguage('', 'uk', () => import('./i18n/resources/uk.json'))


new Vue({
  router,
  store,
  i18n,
  //acl,
  render: h => h(App)
}).$mount('#app')



