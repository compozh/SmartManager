import modules from './modules'

export default {
  install(Vue, {dependencies}){
    dependencies.modulesManager = modules
    Vue.prototype.$modulesManager = modules
  }
}