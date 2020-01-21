// @it-enterprise пакеты
// import WebApps from '@it-enterprise/webappscore';
import Localization from '@it-enterprise/localization'
import Eds from '@it-enterprise/eds'
import GrapgQlCore from '@it-enterprise/graphql'
// import Router from '@it-enterprise/routercore';
import auth from '@it-enterprise/jwtauthentication'
import formio from '@it-enterprise/formio'
import '@it-enterprise/formio/dist/formio.css'

// vue пакеты
import Vue from 'vue'
import Vuex from 'vuex'
import vuetify from './plugins/vuetify'
// import Vuetify from 'vuetify/lib';
// import 'vuetify/dist/vuetify.min.css';
import axios from 'axios'
import { i18n } from './plugins/i18n'
import VueI18n from 'vue-i18n'
import store from './store/index'
import VueSplit from 'vue-split-panel'
import { Tree, Collapse, CollapseItem, Tabs, TabPane } from 'element-ui'
import './element-variables.scss'

import router from './router'
import config from './config'
import App from './App.vue'

auth.config(config.GrapgQlUrl);
// объект с зависимостями
let dependencies = {
  store,
  i18n,
  axios,
  router
};

// Плагины стандартные
// Vue.use(Vuetify);
Vue.use(Vuex);
Vue.use(VueI18n);

// VueSplit
Vue.use(VueSplit);

// Element UI
Vue.prototype.$ELEMENT = { size: 'small' };
Vue.use(Tree);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Tabs);
Vue.use(TabPane);

// Плагины it-enterprise
// Vue.use(WebApps, { options: config, dependencies }, () => auth.getToken());
// Vue.use(Router, { options: config, dependencies }, () => auth.getToken());
Vue.use(GrapgQlCore, { options: config, dependencies });
Vue.use(Localization, { dependencies });
Vue.use(Eds, { dependencies });

var formioOptions = {}
formioOptions.authHeader = () => Vue.prototype.$authentication.getAuthHeader()
formioOptions.router = () => router
formioOptions.GraphQlUrl = config.GrapgQlUrl
Vue.use(formio, { options: formioOptions, dependencies });

Vue.prototype.$localization.RegisterLanguage('bpmn', 'en', () => import('./plugins/resources/en.json'));
Vue.prototype.$localization.RegisterLanguage('bpmn', 'ru', () => import('./plugins/resources/ru.json'));
Vue.prototype.$localization.RegisterLanguage('bpmn', 'uk', () => import('./plugins/resources/uk.json'));


// подключение vuetify

// const opts = {
//   theme: {
//     light: true,
//     breakpoint: {
//       thresholds: {
//         xs: 340,
//         sm: 540,
//         md: 800,
//         lg: 1280,
//         xl: 1920,
//       },
//       scrollBarWidth: 24
//     }
//   },
//   icons: {
//     iconfont: 'md',
//   }
// }
// const vuetify = new Vuetify()
// Шина событий
export const eventBus = new Vue({
  router,
  vuetify,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')


// импорт компонентов
const req = require.context('@/components/', true, /\.(vue)$/i);
req.keys().map(key => {
  if (!(req(key).default || {}).name) {
    return;
  }
  Vue.component(req(key).default.name, req(key).default);
});
