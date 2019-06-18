const promise = () => import('./graphQlCore')

const _namespace = 'GraphQlCore'

export default {

  /**
   *
   * @param {*} Vue
   * @param {*} params.dependencies.modulesManager
   */
  install(Vue, params) {
    let { options, dependencies } = params || {}

    if (!dependencies) {
      throw new Error("Зависимости должны быть переданы")
    }

    dependencies.modulesManager.register(_namespace, ()=> promise().then(module => new module.default(options, dependencies)))


  }
}