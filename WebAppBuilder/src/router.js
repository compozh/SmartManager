import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

// Создание роутера
const createRouter = (routes) => {
  let router = new Router({
    mode: 'history',
    base: myConfig.BASE_URL,
    routes: routes
  })

  // Route case-sensitivity hotfix
  if (router.mode === 'history') {
    router.history.getCurrentLocation = function() {
      let path = window.location.pathname
      let base = router.history.base

      // Removes base from path (case-insensitive)
      if (base && path.toLowerCase().indexOf(base.toLowerCase()) === 0) {
        path = path.slice(base.length)
      }
      return (path || '/') + window.location.search + window.location.hash
    }
  }
  return router
}


// Сброс роутера
export function resetRouter() {
  const newRouter = createRouter([])
  router.matcher = newRouter.matcher

  router.history.current.matched.splice(0, router.history.current.matched.length)
  //router.options = newRouter.options

}


// Роутер по умолчанию
const router = createRouter(
  [{
    path: "/:ApplicationId",
    children: [{
      path: "*"
    }]
  }])

export default router