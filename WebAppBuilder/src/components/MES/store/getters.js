export default {
  circularLoader(state) {
    return state.circularLoader
  },
  linearLoader(state) {
    return state.linearLoader
  },
  error(state) {
    return state.error
  },
  getProperties(state) {
    return state.properties
  },
  workCenters(state) {
    return state.workCenters
  },
  tasks(state) {
    return state.tasks;
  },
  installations(state) {
    return state.installations;
  },
  initializeWorkCenters(state) {
    return state.initializeWorkCenters;
  },
  initializeTasks(state) {
    return state.initializeTasks;
  },
  initializeInstallations(state) {
    return state.initializeInstallations;
  },
  menuMiniMode(state, commit) {
    if (state.menuMiniMode === null) {
      state.menuMiniMode = localStorage.getItem("mesMenuMiniMode") === 'true';
    }
    return state.menuMiniMode;
  }
}