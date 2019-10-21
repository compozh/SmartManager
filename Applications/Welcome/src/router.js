import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

let router = new VueRouter({
  mode: 'history',
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
  //base: window.appConfig.BASE_URL + 'purchases/',
  base: process.env.VUE_APP_BASE_PATH_FULL,
  routes: [
    // =============================================================================
    // FULL PAGE LAYOUTS
    // =============================================================================
    {
      path: '',
      component: () => import('./layouts/ContentLayout.vue'),
      children: [
        // =============================================================================
        // PAGES
        // =============================================================================
        {
          path: 'login',
          name: 'page-login',
          component: () => import('./views/pages/Login.vue'),
          meta: {
            rule: 'editor'
          }
        },
        {
          path: '*',
          name: 'main',
          component: () => import('./views/welcome-pages/welcome-main.vue'),
          meta: {
            pageTitle: 'main'
          }
        },
      ]
    },
  ],
})

// protection of paths from an unauthenticated access
router.beforeEach((to, from, next) => {
  // get current user
  Vue.prototype.$authentication.getCurrentUser().then(currentUSer => {
    if (
      to.path === '/login' ||
      to.path === '/error-404' ||
      to.path === '/error-500' ||
      !!currentUSer
    ) {
      return next()
    }
    router.push({path: '/login'})
  })
})
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})
// Роутер по умолчанию
export default router





