
export default {
  setCircularLoader(state, payload) {
    state.circularLoader = payload
  },
  setError(state, payload) {
    state.error = payload
  },
  setProperties(state, payload) {
    state.properties = payload
  },
  setCurrentWorkCenter(state, payload) {
    state.currentWorkCenter = payload
  },
  setWorkCenters(state, payload) {
    state.workCenters = payload
  },
  setTasks(state, payload) {
    state.tasks = payload
  },
  setInstallations(state, payload) {
    state.installations = payload
  },
  setMenuMiniMode(state, payload) {
    state.menuMiniMode = payload
    localStorage.setItem("mesMenuMiniMode", payload.toString());
  }
}