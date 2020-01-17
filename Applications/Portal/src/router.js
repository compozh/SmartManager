import Vue from 'vue'
import VueRouter from 'vue-router'
import { PortalApi } from '@/api/portalApi'
import auth from '@it-enterprise/jwtauthentication'

Vue.use(VueRouter)

export const getRouter = async () => {
  // загрузка описания приложения
  const resp = await PortalApi.getApplicationDescription()
  const appDescription = JSON.parse(resp.data.webapps.application)
  // временно тащим всё из первой секции
  const routesDescription = [...appDescription.Sections[0].Routes]
  const routes = routesDescription.sort((a, b) => {
    return a.Sort > b.Sort ? 1 : (a.Sort < b.Sort ? -1 : 0)
  }).map(route => {
    let components = {}
    route.Components.forEach(component => {
      return components[component.NameInRoute || 'default'] = Vue.component(component.Name)
    })
    return {
      path: route.Path,
      name: route.Id,
      components,
      meta: {
        pageTitle: route.Name
      }
    }
  })
  const routerConfig = {
    mode: 'history',
    scrollBehavior () {
      return { x: 0, y: 0 }
    },
    base: window.appConfig.BASE_URL + '_NABUPORTAL/',
    routes: [
      {
        // =============================================================================
        // MAIN LAYOUT ROUTES
        // =============================================================================

        path: '/',
        component: () => import('./layouts/main/Main.vue'),
        // =============================================================================
        // Theme Routes
        // =============================================================================
        children: routes,
        meta: {
          rule: 'editor'
        }
      },

      // =============================================================================
      // FULL PAGE LAYOUTS
      // =============================================================================
      {
        path: '/',
        component: () => import('@/layouts/full-page/FullPage.vue'),
        children: [
          // =============================================================================
          // PAGES
          // =============================================================================
          {
            path: 'login',
            name: 'page-login',
            component: () => import('@/views/pages/Login.vue'),
            meta: {
              rule: 'editor'
            }
          },
          {
            path: 'error-404',
            name: 'page-error-404',
            component: () => import('@/views/pages/Error404.vue'),
            meta: {
              rule: 'editor'
            }
          },
          {
            path: 'error-500',
            name: 'page-error-500',
            component: () => import('@/views/pages/Error500.vue'),
            meta: {
              rule: 'editor'
            }
          },
        ],
        meta: {
          rule: 'editor'
        }
      },
      // Redirect to 404 page, if no match found
      {
        path: '*',
        redirect: '/error-404'
      }
    ]
  }
  const router = new VueRouter(routerConfig)
  const unProtectedRoutes = [
    '/login',
    '/error-404',
    '/error-500',
    '/not-authorized'
  ]

  // protection of paths from an unauthenticated access
  router.beforeEach(async (to, from, next) => {
    const token = await auth.getToken()
    if (token || unProtectedRoutes.includes(to.path)) {
      return next()
    }
    if (router.currentRoute.name !== 'page-login') {
      await router.push({path: '/login', query: { to: to.path }})
    }
  })

  router.afterEach(() => {
    // Remove initial loading
    const appLoading = document.getElementById('loading-bg')
    if (appLoading) {
      appLoading.style.display = 'none'
    }
  })
  router.history.getCurrentLocation = () => {
    let path = window.location.pathname
    let base = router.history.base
    // Removes base from path (case-insensitive)
    if (base && path.toLowerCase().indexOf(base.toLowerCase()) === 0) {
      path = path.slice(base.length)
    }
    return (path || '/') + window.location.search + window.location.hash
  }

  // Роутер по умолчанию
  return router
}
