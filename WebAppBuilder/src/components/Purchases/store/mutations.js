export default {
  setLoading(state, payload) {
    state.loading = payload
  },
  setError(state, payload) {
    state.error = payload
  },
  clearError(state) {
    state.error = null
  },  
  setMenuMiniMode(state, payload) {
    state.menuMiniMode = payload
    localStorage.setItem("purchasesMenuMiniMode", payload.toString());
  },
  setSearch(state, payload) {
    state.search = payload
  },
}