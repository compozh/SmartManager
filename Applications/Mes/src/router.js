import Vue from 'vue'
import VueRouter from 'vue-router'
import cookies from 'vue-cookies'

Vue.use(VueRouter)

let  cookiesUuid = cookies.get('mesUuid'),
  sessionStorageUuid = window.sessionStorage.getItem('mesUuid')

export const router = new VueRouter({
  mode: 'history',
  base: window.myConfig.BASE_URL + "MES/" ,
  // params: {
  //   fixedUuid: window.location.search.replace('?fixedUuid=','')
  // },
  routes: [
    {
      path: '/',
      component: () => import('./components/MesLayout.vue'),
      children:  [
        {
          name: 'MESLOGIN',
          path: 'login',
          caseSensitive: false,
          meta: {
            rule: 'isPublic',
          },
          // component: () => import('@/public/components/Authentification/Login.vue'),
        },
        {
          name: 'TASKS',
          path: 'tasks',
          id: 'TASKS',
          component: () => import('@/components/pages/Tasks.vue'),
          meta: {
            rule: 'isPublic',
          },
          caseSensitive: false,
          allowAnonymous: false,
          text: "mes.menu.tasks",
          sort: "1",
          image: "assignment",
        },
        { 
          name: 'QUALITY',
          path: "quality/",
          id: "QUALITY",
          component: () => import('@/components/pages/Quality.vue'),
          meta: {
            rule: 'isPublic',
          },
          caseSensitive: false,
          allowAnonymous: false,
          text: "mes.menu.quality",
          sort: "5",
          image: "bar_chart",
        },
        {
          name: 'DOWNTIMES',
          path: 'downtimes/',
          id: "DOWNTIMES",
          component: () => import('@/components/pages/Downtimes.vue'),
          meta: {
            rule: 'isPublic',
          },
          caseSensitive: false,
          allowAnonymous: false,
          text: "mes.menu.downtimes",
          sort: "4",
          image: "warning",
        },
        {
          name: 'INSTALLATIONS',
          path: 'installations/',
          id: "INSTALLATIONS",
          component: () => import('@/components/pages/Installations.vue'),
          meta: {
            rule: 'isPublic',
          },
          caseSensitive: false,
          allowAnonymous: false,
          text: "mes.menu.installations",
          sort: "3",
          image: "archive",
        },
        {
          name: 'PRODUCTIONS',
          path: "productions",
          id: "PRODUCTIONS",
          component: () => import('@/components/pages/Productions.vue'),
          meta: {
            rule: 'isPublic',
          },
          caseSensitive: false,
          allowAnonymous: false,
          text: "mes.menu.productions",
          sort: "2",
          image: "chrome_reader_mode",
        },
        {
          path: '/dynamic/:id',
          name: 'DYNAMIC',
          id: "DYNAMIC",
          component : () => import('@/components/pages/DynamicPage.vue'),
          caseSensitive: false,
        },
        {
          path: '/',
          name: 'home',
          component: () => import('@/components/pages/Main.vue'),
        },
        {
          path: 'error/:status_code',
          name: 'ERROR',
          component: () => import('@/components/pages/Error.vue'),
          meta: {
            rule: 'isPublic',
            isMenu: false
          },
          caseSensitive: false
        },
      ]
    },
    {
      path: '/*',
      redirect: 'error/404/',
      caseSensitive: false
    }
  ]
})

router.beforeEach((to, from, next) => {
  if(from.query.to && to.name == from.name) {
    return router.push({ path: from.query.to, query: {fixedUuid: from.query.fixedUuid || cookiesUuid || sessionStorageUuid }} )
  }
  Vue.prototype.$authentication.getCurrentUser().then(currentUSer => {
    if(
      from.path == to.path 
      && from.path === '/login' && 
      !!currentUSer) {
        router.push({ name: 'home'}).then(() => {
          router.go()
        })
        return 
    } 
    if (
      to.path === '/login' ||
      to.path === '/error/404' ||
      to.path === '/error/500' ||
      !!currentUSer
    ) {
      return next()
    }
    router.push({ name: 'MESLOGIN', query: { to: to.path , fixedUuid: cookiesUuid}} )
  })
})
export default router
