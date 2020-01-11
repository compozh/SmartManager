import Vue from 'vue';
import VueRouter from 'vue-router';
import config from './config';
Vue.use(VueRouter);

// Роутер по умолчанию
export const routerDependencies = {
  router: new VueRouter({
    mode: 'history',
    base: config.BaseUrl,
    routes: [{ path: '/:ApplicationId', children: [{ path: '*' }] }]
  }),
  VueRouter
};
