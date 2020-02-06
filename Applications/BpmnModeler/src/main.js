// @it-enterprise пакеты
import Localization from '@it-enterprise/localization';
import Eds from '@it-enterprise/eds';
import GrapgQlCore from '@it-enterprise/graphql';
import auth from '@it-enterprise/jwtauthentication';
import formio from '@it-enterprise/formio';
import '@it-enterprise/formio/dist/formio.css';

// vue пакеты
import Vue from 'vue';
import Vuex from 'vuex';
import vuetify from './plugins/vuetify';
import axios from 'axios';
import { i18n } from './plugins/i18n';
import VueI18n from 'vue-i18n';
import store from './store/index';
import VueSplit from 'vue-split-panel';
import { Tree, Collapse, CollapseItem, Tabs, TabPane } from 'element-ui';
//import './element-variables.scss';
import '@mdi/font/css/materialdesignicons.min.css';
import 'roboto-fontface/css/roboto/roboto-fontface.css';

import router from './router';
// import config from './config'
const config = window.config;
import App from './App.vue';

auth.config(config.GrapgQlUrl);
// объект с зависимостями
let dependencies = {
  store,
  i18n,
  axios,
  router
};

// Плагины стандартные
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
Vue.use(GrapgQlCore, { options: config, dependencies });
Vue.use(Localization, { dependencies });
Vue.use(Eds, { dependencies });

var formioOptions = {
  auth,
  routerDependencies: () => router,
  GraphQlUrl: config.GrapgQlUrl,
  onError: ({ message, networkError }) => {
    //todo: Обработать ошибку
  }
};
Vue.use(formio, { options: formioOptions, dependencies });

Vue.prototype.$localization.RegisterLanguage('bpmn', 'en', () => import('./plugins/resources/en.json'));
Vue.prototype.$localization.RegisterLanguage('bpmn', 'ru', () => import('./plugins/resources/ru.json'));
Vue.prototype.$localization.RegisterLanguage('bpmn', 'uk', () => import('./plugins/resources/uk.json'));

export const eventBus = new Vue({
  router,
  vuetify,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');


// импорт компонентов
const req = require.context('@/components/', true, /\.(js|vue)$/i);
req.keys().map(key => {
  if (!(req(key).default || {}).name) {
    return;
  }
  Vue.component(req(key).default.name, req(key).default);
});
