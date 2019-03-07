import Vue from 'vue';
import Vuetify from 'vuetify';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import 'vuetify/dist/vuetify.min.css';
import CommonComponent from '@/components/CommonComponent.vue';
import DefaultApp from '@/components/DefaultApp.vue';


Vue.component('common-component', CommonComponent);
Vue.component('default-app', DefaultApp);
Vue.config.productionTip = false;
Vue.use(Vuetify);
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
