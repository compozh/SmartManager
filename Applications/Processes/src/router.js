import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: window.myConfig.BASE_URL + 'PROCESSES/',
  routes: [
    {
      path: '/',
      component: () => import('./MainLayout.vue'),
      children: [
        {
          path: '/',
          name: 'processes',
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

router.beforeEach((to, from, next) => {
  let same = Object.values(to).every((el) => {
    return Object.values(from).find(fromEl => fromEl === el)
  })
  if (same) {

  } else {
    return next()
  }
})

export default router
