import VueRouter from 'vue-router'
import Router from './Router'

let _namespace = 'CoreRouter'
export default {
  install(Vue, { options, dependencies }) {
    let { router } = dependencies

    if (!router) {
      console.warn(
        `%cВнимание!
      VueRouter не был обнаружен среди зависимостей по ключу "router"!
      Будет создан новый экземпляр VueRouter.
      Новый экземпляр будет добавлен в зависимости с ключем "router"!`,
        'font-weight:bold'
      )
      Vue.use(VueRouter)
      router = new VueRouter({
        mode: 'history',
        base: options.BASE_URL,
        routes: [
          {
            path: '/:ApplicationId',
            children: [
              {
                path: '*'
              }
            ]
          }
        ]
      })
      dependencies.router = router
    }

    let coreRouter = new Router(router)
    dependencies.modulesManager.register(_namespace, () => Promise.resolve(coreRouter))
    Vue.prototype.$CoreRouter = coreRouter
  }
}
