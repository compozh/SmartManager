import state from "./state";

export default {
  setCircularLoader ( payload ) {
    state.loading = payload
  },
  setError ( payload ) {
    state.error = payload
  },
  clearError () {
    state.error = null
  },
  setAvailableFilters ( payload ) {
    state.availableFilters = payload
  }
}