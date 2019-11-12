/*=========================================================================================
  File Name: router.js
  Description: Routes for vue-router. Lazy loading is enabled.
  Object Strucutre:
                    path => router path
                    name => router name
                    component(lazy loading) => component to load
                    meta : {
                      rule => which user can have access (ACL)
                      breadcrumb => Add breadcrumb to specific page
                        { title, url, active }
                      pageTitle => Display title besides breadcrumb
                    }
==========================================================================================*/

import Vue from 'vue'
import auth from '@/api/auth/auth'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

let router = new VueRouter({
  mode: 'history',
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
  base: window.appConfig.BASE_URL + 'SmartManager/',
  routes: [

    {
      // =============================================================================
      // MAIN LAYOUT ROUTES
      // =============================================================================
      path: '',
      component: () => import('./layouts/main/Main.vue'),
      children: [
        {
          path: '/',
          redirect: '/tasks/ALL',
          meta: {
            rule: 'admin'
          },
          caseSensitive: false
        },
        {
          path: '/tasks/:code',
          name: 'task-list',
          component: () => import('./views/task-list/TaskList.vue'),
          meta: {
            rule: 'admin'
          },
          caseSensitive: false
        },
        {
          path: '/task/:id',
          name: 'task-view',
          component: () => import('./views/task-view/TaskView.vue'),
          meta: {
            rule: 'admin'
          },
          caseSensitive: false
        },
        {
          path: '/task-add/:id?',
          name: 'task-add',
          component: () => import('./views/task-add/TaskAdd.vue'),
          meta: {
            rule: 'admin'
          },
          caseSensitive: false
        },
        {
          path: '/work-flow',
          name: 'work-flow',
          component: () => import('./views/work-flow/WorkFlow.vue'),
          meta: {
            rule: 'admin'
          },
          caseSensitive: false
        },
        {
          path: '/cases/:id?',
          name: 'case-list',
          component: () => import('./views/case-list/CaseList.vue'),
          meta: {
            rule: 'admin'
          },
          caseSensitive: false
        },
        {
          path: '/case/:id',
          name: 'case-view',
          component: () => import('./views/case-view/CaseView.vue'),
          meta: {
            rule: 'admin'
          },
          caseSensitive: false
        }
      ]
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
          name: 'login',
          component: () => import('@/views/pages/Login.vue'),
          meta: {
            rule: 'editor'
          }
        },
        {
          path: '/pages/error-404',
          name: 'page-error-404',
          component: () => import('@/views/pages/Error404.vue'),
          meta: {
            rule: 'editor'
          }
        },
        {
          path: '/pages/error-500',
          name: 'page-error-500',
          component: () => import('@/views/pages/Error500.vue'),
          meta: {
            rule: 'editor'
          }
        },
        {
          path: '/pages/not-authorized',
          name: 'page-not-authorized',
          component: () => import('@/views/pages/NotAuthorized.vue'),
          meta: {
            rule: 'editor'
          }
        },
      ]
    },
    // Redirect to 404 page, if no match found
    {
      path: '*',
      redirect: '/pages/error-404'
    }
  ],
})

router.history.getCurrentLocation = function() {
  let path = window.location.pathname
  let base = router.history.base

  // Removes base from path (case-insensitive)
  if (base && path.toLowerCase().indexOf(base.toLowerCase()) === 0) {
    path = path.slice(base.length)
  }

  return (path || '/') + window.location.search + window.location.hash
}

// protection of paths from an unauthenticated access
router.beforeEach((to, from, next) => {

  // get current user
  const currentUSer = auth.getCurrentUser()
  if (
    to.path === '/login' ||
        to.path === '/error-404' ||
        to.path === '/error-500' ||
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
