import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'
Vue.use(VueRouter)


export const router = new VueRouter({
  mode: 'history',
  base: window.myConfig.BASE_URL + "MES/" ,
  params: {
    fixedUuid: window.location.search.replace('?fixedUuid=','')
  },
  routes: [
    {
      path: '/',
      name: 'MESROOT',
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
          text: "Задания",
          sort: "1",
          image: "assignment",
        },
        { 
          name: 'QUALITY',
          path: "quality/:id?",
          id: "QUALITY",
          component: () => import('@/components/pages/Quality.vue'),
          meta: {
            rule: 'isPublic',
          },
          caseSensitive: false,
          allowAnonymous: false,
          text: "Качество",
          sort: "5",
          image: "bar_chart",
          // UniqId: "65f12887-f58d-4986-903a-b7742901c394",
        },
        {
          name: 'DOWNTIMES',
          path: 'downtimes/:id?',
          id: "DOWNTIMES",
          component: () => import('@/components/pages/Downtimes.vue'),
          meta: {
            rule: 'isPublic',
          },
          caseSensitive: false,
          allowAnonymous: false,
          text: "Простои",
          sort: "4",
          image: "warning",
          // UniqId: "580d530e-8eaf-4457-9b18-d3ca4d701893"
        },
        {
          name: 'INSTALLATIONS',
          path: 'installations/:id?',
          id: "INSTALLATIONS",
          component: () => import('@/components/pages/Installations.vue'),
          meta: {
            rule: 'isPublic',
          },
          caseSensitive: false,
          allowAnonymous: false,
          text: "Установка материалов",
          sort: "3",
          image: "archive",
          // UniqId: "7e30a0ea-4339-4598-a51e-387978de535b",
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
          text: "Журнал работ",
          sort: "2",
          image: "chrome_reader_mode",
          // UniqId: "adf35957-e0f6-4543-9787-d6159c413c4d",
        },
        {
          path: '/dynamic/:id',
          name: 'DYNAMIC',
          id: "DYNAMIC",
      
          component : () => import('@/components/pages/DynamicPage.vue'),
          // image: 'description',
          caseSensitive: false,
      
        },
        {
          path: '/',
          name: 'home',
          component: () => import('@/components/pages/Main.vue'),
        },
        {
          path: 'error/:status_code',
          name: 'ERRORr',
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
  Vue.prototype.$authentication.getCurrentUser().then(currentUSer => {
    if(
      from.path == to.path 
      && from.path === '/login' && 
      !!currentUSer) {
        // router.go()
        return   next({name: 'home'})
    } 
    if (
      to.path === '/login' ||
      to.path === '/error/404' ||
      to.path === '/error/500' ||
      !!currentUSer
    ) {
      console.log(router)
      return next()
    }
    router.push({ name: 'MESLOGIN', params:{ routeToBack: from.path }} )
  })
})
export default router
