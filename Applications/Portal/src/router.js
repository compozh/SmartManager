import Vue from 'vue'
import VueRouter from 'vue-router'
import { PortalApi } from '@/api/portalApi'

Vue.use(VueRouter)

export async function  getRouter() {

  // загрузка описания приложения
  let resp = await PortalApi.getApplicationDescription()

  let appDescription = JSON.parse(resp.data.webapps.application)

  // временно тащим всё из первой секции
  let routesDescription = [...appDescription.Sections[0].Routes]
  let routes = routesDescription.sort((a,b) => a.Sort > b.Sort ? 1 : (a.Sort < b.Sort ? -1 : 0)).map( r => {


    let components = {}
    r.Components.forEach(c => components[c.NameInRoute || 'default'] = Vue.component(c.Name) )


    return {
      path: r.Path,
      name: r.Id,
      components,
      meta: {
        pageTitle: r.Name
      }
    }
  })

  let routerConfig = {
    mode: 'history',
    scrollBehavior () {
      return { x: 0, y: 0 }
    },
    base: process.env.VUE_APP_BASE_PATH_FULL,
    routes: [
      {
        // =============================================================================
        // MAIN LAYOUT ROUTES
        // =============================================================================

        path: '/:applicationId',
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
        path: '/:applicationId',
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
        path: '/:applicationId/*',
        redirect: '/:applicationId/error-404'
      }
    ]
  }






  let router = new VueRouter(routerConfig)


  // protection of paths from an unauthenticated access
  router.beforeEach((to, from, next) => {

    // get firebase current user
    Vue.prototype.$authentication.ActualizeCurrentUser().then(currentUSer => {
      if (
        to.path.endsWith('/login') ||
          to.path.endsWith('/forgot-password') ||
          to.path.endsWith('/error-404') ||
          to.path.endsWith('/error-500') ||
          to.path.endsWith('/register') ||
          !!currentUSer
      ) {
        return next()
      }
      router.push({ name: 'page-login', query: { to: to.path }, params: {...to.params} })
      // Specify the current path as the customState parameter, meaning it
      // will be returned to the application after auth
      // auth.login({ target: to.path });
    }).catch( (e) => {
      if (
        to.path.endsWith('/login') ||
          to.path.endsWith('/forgot-password') ||
          to.path.endsWith('/error-404') ||
          to.path.endsWith('/error-500') ||
          to.path.endsWith('/register') ||
          !!e.response.status == 401
      ) {
        return next()
      }
      router.push({ name: 'page-login', query: { to: to.path }, params: {...to.params} })

    })

  })


  router.afterEach(() => {
    // Remove initial loading
    const appLoading = document.getElementById('loading-bg')
    if (appLoading) {
      appLoading.style.display = 'none'
    }
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

  // Роутер по умолчанию
  return router
}


// let args = {
//   query:
//     'query q($appId : String) {\n  webapps{\n    application(applicationId:$appId)\n  }\n}',
//   schema: 'WEBAPPS',
//   variables: { appId },
//   operationName: 'q'
// }





