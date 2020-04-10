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
import './registerServiceWorker'
import '@it-enterprise/formio/dist/formio.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
