import Router from './Router'

let _namespace = 'CoreRouter'
export default {
  install(Vue, { options, dependencies }) {
    let { router } = dependencies

    if (!router) {
      throw new Error('VueRouter не был обнаружен среди зависимостей по ключу "router"!')

    }

    let coreRouter = new Router(router)

    dependencies.modulesManager.register(_namespace, () => Promise.resolve(coreRouter))
    Vue.prototype.$CoreRouter = coreRouter
  }
}
