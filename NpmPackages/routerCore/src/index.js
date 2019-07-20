import Router from './Router'
export default {
  install(Vue, { dependencies }) {
    let { router } = dependencies

    if (!router) {
      throw new Error('экземпляр VueRouter не был обнаружен среди зависимостей по ключу "router"!')

    }
    let coreRouter = new Router(router, dependencies)
    Vue.prototype.$CoreRouter = coreRouter
  }
}
