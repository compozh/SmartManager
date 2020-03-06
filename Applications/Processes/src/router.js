import Vue from 'vue'
import VueRouter from 'vue-router'
import auth from '@it-enterprise/jwtauthentication'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: window.myConfig.BASE_URL + 'processes/',
  routes: [
    {
      path: '/',
      component: () => import('./MainLayout.vue'),
      children: [
        {
          name: 'login',
          path: '/login',
          caseSensitive: false,
          component: () => import('@/components/layouts/login/Login.vue'),
          props: { allowQrMode: true }
        },
        {
          name: 'processes',
          path: '/',
          component: () => import('./pages/ProcessesGrid.vue'),
          caseSensitive: false
        },
        {
          path: '/:id',
          name: 'process-form-page',
          component: () => import('./pages/ProcessForm.vue'),
          caseSensitive: false
        }
      ]
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const token = await auth.getToken()
  if (to.path === '/login' || to.path === 'login' || token) {
    let same = Object.values(to).every((el) => {
      return Object.values(from).find(fromEl => fromEl === el)
    })
    if (!same) {
      next()
    }
  } else {
    router.push({ name: 'login', query: { to: to.path } })
  }
})

export default router
