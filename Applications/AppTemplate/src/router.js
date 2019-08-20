import Vue from 'vue'
import auth from '@/api/auth/auth'
import VueRouter from 'vue-router'
Vue.use(VueRouter)



let router = new VueRouter({
  mode: 'history',
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
  base: window.appConfig.BASE_URL,
  routes: [
    {
      // =============================================================================
      // MAIN LAYOUT ROUTES
      // =============================================================================
      path: '',
      component: () => import('./layouts/main/Main.vue'),
      children: [
        // =============================================================================
        // Theme Routes
        // =============================================================================
        {
          path: '/',
          name: 'home',
          component: () => import('./views/Home.vue'),
          meta: {
            rule: 'public'
          }
        },
        {
          path: '/page2',
          name: 'page-2',
          component: () => import('./views/Page2.vue'),
          meta: {
            breadcrumb: [
              {title: 'a'},
              {title: 'b'},
              {title: 'c'},

            ],

            rule: 'public'

          }
        },
        {
          path: '/page3',
          name: 'page-3',
          component: () => import('./views/Page2.vue'),
          meta: {
            rule: 'public'

          }
        },
      ],
    },
    // =============================================================================
    // FULL PAGE LAYOUTS
    // =============================================================================
    {
      path: '',
      component: () => import('@/layouts/full-page/FullPage.vue'),
      children: [
        // =============================================================================
        // PAGES
        // =============================================================================
        {
          path: '/login',
          name: 'page-login',
          component: () => import('@/views/pages/Login.vue'),
          meta: {
            rule: 'public'
          }
        },
        {
          path: '/error-404',
          name: 'page-error-404',
          component: () => import('@/views/pages/Error404.vue'),
          meta: {
            rule: 'public'
          }
        },
        {
          path: '/error-500',
          name: 'page-error-500',
          component: () => import('@/views/pages/Error500.vue'),
          meta: {
            rule: 'public'
          }
        },
      ]
    },
    // Redirect to 404 page, if no match found
    {
      path: '*',
      redirect: '/error-404'
    }
  ]
})


// protection of paths from an unauthenticated access
router.beforeEach((to, from, next) => {

  // get firebase current user
  const currentUSer = auth.getCurrentUser()
  if (
    to.path === '/login' ||
        to.path === '/forgot-password' ||
        to.path === '/error-404' ||
        to.path === '/error-500' ||
        to.path === '/register' ||
        to.path === '/callback' ||

        !!currentUSer
  ) {
    return next()
  }

  router.push({ path: '/login', query: { to: to.path } })
  // Specify the current path as the customState parameter, meaning it
  // will be returned to the application after auth
  // auth.login({ target: to.path });
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
