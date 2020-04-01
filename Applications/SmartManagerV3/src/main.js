import Vue from 'vue'
import App from './App.vue'
import store from './store'
import vuetify from './plugins/vuetify'
import GraphQlCore from '@it-enterprise/graphql'
import apollo from '@/utils/apollo'
import i18n from './i18n'
import VueSplit from 'vue-split-panel'
import PerfectScrollbar from 'vue2-perfect-scrollbar'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'
import router from './router'
import axios from 'axios'
import '@/utils/faIcons'
import './registerServiceWorker'

Vue.config.productionTip = false

Vue.use(VueSplit)
Vue.use(PerfectScrollbar)
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
