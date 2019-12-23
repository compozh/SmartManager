// http://tfs2017:8080/tfs/DefaultCollection/_git/WebApplicationsimport Vue from 'vue'

import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
debugger
// Роутер по умолчанию
const  router = new VueRouter({
  mode: 'history',
  base: window.myConfig.BASE_URL ,
  params: {fixedUuid: window.location.search.replace('?fixedUuid=','')},
  routes: [
    {
      path: '/:ApplicationId',
      name: 'MESROOT',
      component: () => import('./components/MesLayout.vue'),
      children: [
        {
          path: 'tasks',
          name: 'TASKS',
          component: () => import('@/components/pages/Tasks.vue'),
          meta: {
            rule: 'isPublic',
            // isMenu: false
          },
          caseSensitive: false
        },
        {
          path: 'login',
          name: 'MESLOGIN',
          // component: () => import('@/public/components/Authentification/Login.vue'),
          // meta: {
          //   rule: 'isPublic',
          //   isMenu: false
          // },
          caseSensitive: false
        },
        // {
        //   path: '*',
        //   name: 'navigation-drawer',
        //   component: () => import('@/components/MesMenu.vue')
        // },
        // {
        //   path: '*',
        //   name: 'toolbar',
        //   component: () => import('@/components/MesToolbar.vue')
        // },
        
      // {
      //   path: '/',
      //   name: 'home',
      //   component: () => import('./components/MesLayout.vue'),
      //   meta: {
      //     rule: 'isNormal',
      //     // icon: 'home',
      //     // caption: 'purchases.Menu.Home',
      //     // isMenu: true
      //   },
      //   caseSensitive: false
      // },
      {
        path: 'quality',
        name: 'QUALITY',
        component: () => import('@/components/pages/Quality.vue'),
        meta: {
          rule: 'isPublic',
          // isMenu: false
        },
        caseSensitive: false
      },
      {
        path: 'downtimes',
        name: 'DOWNTIMES',
        component: () => import('@/components/pages/Downtimes.vue'),
        meta: {
          rule: 'isPublic',
          // isMenu: false
        },
        caseSensitive: false
      },
      {
        path: 'installations',
        name: 'INSTALLATIONS',
        component: () => import('@/components/pages/Installations.vue'),
        meta: {
          rule: 'isPublic',
          // isMenu: false
        },
        caseSensitive: false
      },
      {
        path: 'productions',
        name: 'PRODUCTIONS',
        component: () => import('@/components/pages/Productions.vue'),
        meta: {
          rule: 'isPublic',
          // isMenu: false
        },
        caseSensitive: false
      },
      ]
    }
  ]
})
  
router.beforeEach((to, from, next) => {
  // get current user
  Vue.prototype.$authentication.getCurrentUser().then(currentUSer => {
    if (
      to.path === '/login' ||
      // to.path === '/error/404' ||
      // to.path === '/error/500' ||
      !!currentUSer
    ) {
      return next()
    }
    router.push({ name: 'login', query: { to: to.path } })
  })
  // Specify the current path as the customState parameter, meaning it
  // will be returned to the application after auth
  // auth.login({ target: to.path });
})
export default router
