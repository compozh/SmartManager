import Vue from 'vue'
import App from '@/App.vue'
import store from '@/store'
import i18n from '@/i18n'
import router from '@/router'
import vuetify from '@/plugins/vuetify'
import '@/plugins'
import '@/utils/graphql'
import '@/utils/localization'
import '@/utils/formio'
import '@/utils/faIcons'
import '@/assets/fonts/proxima.css'
import '@/assets/scss/main.scss'
import '@/mixins/rtl'
import './registerServiceWorker'

Vue.config.productionTip = false
Vue.config.devtools = true

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
