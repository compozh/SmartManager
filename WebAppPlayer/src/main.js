import Vue from 'vue'
import Vuetify from 'vuetify'
import WebApps from '@it-enterprise/webAppsCore'
import { i18n } from './plugins.1/i18n'
import 'vuetify/dist/vuetify.min.css'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import {ApolloClient} from 'apollo-client'
import {HttpLink} from 'apollo-link-http'
import {InMemoryCache} from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'


export const eventBus = new Vue() // Шина событий



Vue.use(VueRouter)
Vue.use(Vuetify)
Vue.use(Vuex)

Vue.use(VueApollo)

// Cache implementation
const cache = new InMemoryCache()
const apolloClient = new ApolloClient({
  link: new HttpLink({}),
  cache,
  connectToDevTools: true,
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})


// Create a new store
const store = new Vuex.Store({})


let router = new VueRouter({
  mode: 'history',
  base: window.myConfig.BASE_URL,
  routes: [{path: '/:ApplicationId',children: [{path: '*'}]}
  ]
})

// объект с зависимостями
let d = {
  store,
  router
}

Vue.use(WebApps, {
  dependencies: d,
  options: window.myConfig
})

// временный импорт компонентов
const req = require.context('@/components/', true, /\.(js|vue)$/i)
req.keys().map(key => {
  if (!(req(key).default || {}).name) {
    return
  }
  Vue.component(req(key).default.name, req(key).default)
})

start()

async function start()   {
  // Загрузка приложения
  let webAppsCore = await d.modulesManager.getWebApps()

  let appComponent = await webAppsCore.GetApplicationComponent({

    properties: {
      i18n,
      store,
      apolloProvider
    }
  })

  new Vue(appComponent).$mount('#app')
}
