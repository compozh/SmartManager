
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
  setInitializeWorkCenters(state, initializeWorkCenters) {
    state.initializeWorkCenters = initializeWorkCenters;
  },
  setInstallationsByWorkCenter(state, { installations, workCenterCode}) {
    state.installations[workCenterCode] = installations;
  },
  setInitializeTasks(state, initializeTasks) {
    state.initializeTasks = initializeTasks;    
  },
  setInitializeInstallations(state, initializeInstallations) {
    state.initializeInstalltions = initializeInstallations;
  },
  removeInstallation(state, { installation, workCenterCode }) {
    var installationsByWorkCenter = state.installations[workCenterCode];
    if(installationsByWorkCenter && installationsByWorkCenter.length) {
      var index = installationsByWorkCenter.indexOf(installation);
      installationsByWorkCenter.splice(index, 1);
    }
  },
  setMenuMiniMode(state, payload) {
    state.menuMiniMode = payload
    localStorage.setItem("mesMenuMiniMode", payload.toString());
  }
}