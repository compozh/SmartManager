import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import state from './state'

export default {
  namespaced: true,
  namespace: 'bpmn',
  actions,
  getters,
  mutations,
  state
}
