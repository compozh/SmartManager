import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import state from './state'

import authModule from './auth/moduleAuth'

export default {
  namespaced: true,
  namespace: 'eam',
  actions,
  getters,
  mutations,
  state,
  modules: {
    auth: authModule
  }
}