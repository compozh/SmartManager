import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

// Роутер по умолчанию
export const routerDependencies = {
  router: new VueRouter({
    mode: 'history',
    base: window.config.BaseUrl,
    routes: [{ path: '/:ApplicationId', children: [{ path: '*' }] }]
  }),
  VueRouter
};
