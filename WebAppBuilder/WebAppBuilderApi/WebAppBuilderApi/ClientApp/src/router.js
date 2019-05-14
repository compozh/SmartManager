import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

// Создание роутера
const createRouter = (routes) => {
  return new Router({
    mode: 'history',
    base: myConfig.BASE_URL,
    routes: routes
  })
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