import actions from './smActions'
import getters from './smGetters'
import mutations from './smMutations'
import state from './smState'

// Modules
import attachments from '../attachments/store'

export default {
  namespaced: true,
  namespace: 'sm',
  actions,
  getters,
  mutations,
  state,
  modules: {
    attachments
  }
}
