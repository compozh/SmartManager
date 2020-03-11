import * as idb from 'idb-keyval'

export default {
  install (Vue) {
    Vue.prototype.$idb = idb
  }
}