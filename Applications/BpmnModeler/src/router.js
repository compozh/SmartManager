
import Vue from 'vue'
import VueRouter from 'vue-router'
// import config from './config'
import store from './store/index'

Vue.use(VueRouter)

export const router = new VueRouter({
  mode: 'history',
  base: config.BaseUrl + 'newBPMNMODELER/',
  routes: [
    {
      path: '/',
      component: () => import('./components/BpmnLayout.vue'),
      children: [
        {
          name: 'Login',
          path: '/login',
          caseSensitive: false,
          meta: {
            rule: 'isPublic',
          },
          component: () => import('@/components/pages/Login.vue'),
        },
        {
          path: '/',
          name: 'Main',
          component: () => import('@/components/pages/Main.vue'),
          meta: {
            rule: 'isPublic',
          },
        },
        {
          name: 'Project',
          path: '/project/:id?',
          component: () => import('@/components/pages/Project.vue'),
          meta: {
            rule: 'isPublic',
          },
          caseSensitive: false,
          allowAnonymous: false,
          props: {
            item: Object
          },
        }, 
        {
          name: 'Decision',
          path: '/decision/:id?',
          component: () => import('@/components/modelers/DmnModeler.vue'),
          meta: {
            rule: 'isPublic',
          },
          caseSensitive: false,
          allowAnonymous: false,
        },
        {
          name: 'Process',
          path: '/process/:id?',
          component: () => import('@/components/modelers/BpmnModeler.vue'),
          meta: {
            rule: 'isPublic',
          },
          caseSensitive: false,
          allowAnonymous: false,
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


router.beforeEach((to, from, next) => {
  if (
    to.path === '/login' ||
    to.path === '/error/404' ||
    to.path === '/error/500' ||
    !!store.state.auth.user
  ) {
    let same = Object.values(to).every((el) => {
      return Object.values(from).find( fromEl =>  fromEl == el) 
    })
    if ( same ) {
      return 
    } else  {
      return next()
    }
  }
  router.push({ name: 'Login', query: { to: to.path } })
})

export default router
