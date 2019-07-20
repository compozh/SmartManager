import Authentication from './authentication'

export default {
  install(Vue, params) {
    let { dependencies } = params || {}

    if (!dependencies) {
      throw new Error("Зависимости должны быть переданы!")
    }

    let authentication = new Authentication(dependencies)
    Vue.prototype.$authentication = authentication
  }
}
