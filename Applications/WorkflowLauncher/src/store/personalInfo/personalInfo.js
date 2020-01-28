import state from './personalInfoState'
import actions from './personalInfoActions'
import getters from './personalInfoGetters'
import mutations from './personalInfoMutations'

export default {
  namespaced: true,
  namespace: 'personalInfo',
  state,
  actions,
  getters,
  mutations
}
