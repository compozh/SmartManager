import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store/index'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: window.myConfig.BASE_URL + "MES/",
  routes: [
    {
      path: '/',
      component: () => import('./components/MesLayout.vue'),
      children:  [
        {
          name: 'MESLOGIN',
          path: '/login',
          caseSensitive: false,
          meta: {
            rule: 'isPublic',
          },
          component: () => import('@/components/layouts/login/Login.vue'),
        },
        {
          path: '/',
          name: 'home',
          component: () => import('@/components/pages/Main.vue'),
          meta: {
            rule: 'isPublic',
          },
          beforeEnter : func ,
        },
        {
          name: 'TASKS',
          path: '/tasks',
          id: 'TASKS',
          component: () => import('@/components/pages/Tasks.vue'),
          meta: {
            rule: 'Production',
          },
          caseSensitive: false,
          allowAnonymous: false,
          text: "mes.menu.tasks",
          sort: "1",
          image: "assignment",
        },
        { 
          name: 'QUALITY',
          path: "/quality",
          id: "QUALITY",
          component: () => import('@/components/pages/Quality.vue'),
          meta: {
            rule: 'onlyQuality',
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
            rule: 'Production',
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
            rule: 'onlyInstallations',
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
            rule: 'Production',
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
          meta: {
            rule: 'allPages',
          },
          component : () => import('@/components/pages/DynamicPage.vue'),
          caseSensitive: false,
        },
        {
          path: 'error/:status_code/',
          name: 'ERROR',
          component: () => import('@/components/pages/Error.vue'),
          meta: {
            rule: 'isPublic',
          },
          caseSensitive: false
        },
      ]
    },
    {
      path: '/*',
      redirect: 'error/404/',
      caseSensitive: false,
      meta: {
        rule: 'isPublic',
      },
    }
  ]
})

function func(to,from, next) {
  let workCenter = store.getters['mes/workCenter']
  let result
  if(workCenter) {
    let access =  workCenter.accessPages
    result = 
        access === 'QUALITY' ? '/quality' : 
        access === 'ONLY_INSTALLATION' ? '/installations' :
        access === 'PRODUCTION' ? '/productions' 
        : '/tasks'
    return next({ path: result, query: {fixedUuid: router.currentRoute.query.fixedUuid}})
  } else if(!store.state.auth.user){
    router.go()
  } else {
    return next()
  }
}

router.beforeEach((to, from, next) => {
  let same = Object.values(to).every((el) => {
    return Object.values(from).find( fromEl =>  fromEl == el) 
  })
  if( same ) {
    return 
  } else  {
    return next()
  }
})
export default router
