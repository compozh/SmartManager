import Vue from 'vue'
import Vuetify from 'vuetify'
import WebApps from './plugins/webApps/index'
import { i18n } from './plugins.1/i18n'
import 'vuetify/dist/vuetify.min.css'
import Vuex from 'vuex'

Vue.use(Vuetify)
Vue.use(Vuex)

// Create a new store
const store = new Vuex.Store({})


// объект с зависимостями
let d = {
  store
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

async function start()   {
  // Загрузка приложения
  let webAppsCore = await d.modulesManager.getWebApps()

  let appComponent = await webAppsCore.GetApplicationComponent({
    appId: 'SKD',
    properties: {
      i18n,
      router: d.router,
      store
    }
  })

  new Vue(appComponent).$mount('#app')
}

start()

// .then(res => res.LoadAppDescription("SKD"))
//   .then(res => {
//     new Vue({
//       i18n,
//       router:d.router,
//       render: h => h(res.RootComponent.Name)
//     }).$mount("#app")
//   })

// setTimeout(() => {
//   resolve({
//     created(){

//       this.$modulesManager.getAuthentication().then(res => res.logIn("melentyev@it.ua", "vbkkth", true))
//     },
//     render: h => h("H6", ["TEST2"])
//   })
// }, 5000);
