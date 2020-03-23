import Vue from 'vue'
import App from './App.vue'
import store from './store'
import vuetify from './plugins/vuetify'
import GraphQlCore from '@it-enterprise/graphql'
import apollo from '@/utils/apollo'
import i18n from './i18n'
import router from './router'
import axios from 'axios'
import './registerServiceWorker'

Vue.config.productionTip = false

Vue.use(GraphQlCore, {
  options: window.appConfig,
  dependencies: {
    apolloProvider: apollo,
    axios
  }
})

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
