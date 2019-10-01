import state from './educationState'
import actions from './educationActions'
import getters from './educationGetters'
import mutations from './educationMutations'

export default {
  namespaced: true,
  namespace: 'education',
  state,
  actions,
  getters,
  mutations
}