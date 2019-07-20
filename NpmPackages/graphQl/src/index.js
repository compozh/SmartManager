
import GraphQlCore from './graphQlCore'

export default {

  /**
   * Плагин для работы с GrapgQl
   * @param {*} Vue
   */
  install(Vue, params) {
    let {
      options,
      dependencies
    } = params || {}

    if (!dependencies) {
      throw new Error('Зависимости должны быть переданы')
    }

    let { apolloProvider } = dependencies

    Vue.prototype.$apolloProvider = apolloProvider

    Vue.prototype.$graphQlCore = new GraphQlCore(options, dependencies)

  }
}
