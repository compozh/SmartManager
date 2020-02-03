import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: window.myConfig.BASE_URL + 'PROCESS/',
  routes: [
    {
      path: '/',
      component: () => import('../MainLayout.vue'),
      children: [
        {
          path: '/processes',
          name: 'processes',
          component: () => import('../pages/processes.vue'),
          caseSensitive: false
        },
        {
          path: '/processes/:id',
          name: 'process',
          component: () => import('../pages/processForm.vue'),
          caseSensitive: false
        }
      ]
    }
  ]
})

export default router
