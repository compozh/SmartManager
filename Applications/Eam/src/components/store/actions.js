export default {
  setLoading({commit}, payload) {
    commit('setLoading', payload)
  },
  setError({commit}, payload) {
    commit('setError', payload)
  },
  clearError({commit}) {
    commit('clearError')
  },
  toggleMenuMiniMode({getters, commit}) {
    commit('setMenuMiniMode', !getters.menuMiniMode)
  },
}