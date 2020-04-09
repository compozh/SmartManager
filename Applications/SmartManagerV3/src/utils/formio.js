import Vue from 'vue'
import formio from '@it-enterprise/formio'
import '@it-enterprise/formio/dist/formio.css'
import store from '@/store'
import auth from '@/utils/auth'
import router from '@/router'

const options = {
  auth,
  WsUrl: window.appConfig.WsUrl,
  routerDependencies: () => ({ router }),
  GraphQlUrl: window.appConfig.GrapgQlUrl
}

Vue.use(formio, {
  options,
  dependencies: { store }
})
