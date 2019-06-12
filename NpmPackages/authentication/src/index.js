import Authentication from './authentication'
const _namespace = "Authentication"

export default {
  install(Vue, params) {
    let { dependencies } = params || {}

    if (!dependencies) {
      throw new Error("Зависимости должны быть переданы!")
    }

    let authentication = new Authentication(dependencies)
    dependencies.modulesManager.register(_namespace, () => Promise.resolve(authentication))
  }
}
