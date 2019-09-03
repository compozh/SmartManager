
export default {

  setCircularLoader (state, payload ) {
    state.loading = payload
  },
  setError (state, payload ) {
    state.error = payload
  },
  clearError (state) {
    state.error = null
  },
  setAvailableFilters (state, payload ) {
    state.availableFilters = payload
  }
}
