import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// Роутер по умолчанию
export const routerDependencies = {
  router: new VueRouter({
    mode: 'history',
    base: window.myConfig.BASE_URL,
    params: {fixedUuid: window.location.search.replace('?fixedUuid=','')},
    routes: [{path: '/:ApplicationId', children: [{path: '*'}]}
    ]
  }),
  VueRouter
}
