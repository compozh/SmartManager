import {KeysApi} from '@/api/keysApi.js'
export default {
  loadDocuments({state, commit}) {

    return KeysApi.getDocuments(state.filter.dateFrom, state.filter.dateTo).then(response => {
      commit('setDocuments', response.data.keysQuery.documents)
    })
  },

  setFilter({dispatch, commit}, filter) {
    commit('setFilter', filter)
    dispatch('loadDocuments')
  }

}
