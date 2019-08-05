
export default {
  setLinearLoader(state, payload) {
    state.linearLoader = payload
  },
  setError(state, payload) {
    state.error = payload
  },
  setProperties(state, properties) {
    state.properties = properties
  },
  setWorkCenters(state, workCenters) {
    state.workCenters = workCenters;
  },
  setTasks(state, tasks) {
    state.tasks = tasks;
  },
  setInstallations(state, installations) {
    state.installations = installations;
  },
  setInstallationsByWorkCenter(state, { installations, workCenterCode}) {
    state.installations[workCenterCode] = installations;
  },
  removeInstallation(state, { installation, workCenterCode }) {
    var installationsByWorkCenter = state.installations[workCenterCode];
    if(installationsByWorkCenter && installationsByWorkCenter.length) {
      var index = installationsByWorkCenter.indexOf(installation);
      installationsByWorkCenter.splice(index, 1);
    }
  },
  setProductions(state, productions) {
    state.productions = productions;
  },
  setProductionFormio(state, {formio, workCenterCode}) {
    state.productionFormio[workCenterCode] = formio;
  },
  removeProduction(state, production) {
      let index = state.productions.indexOf(production);
      state.productions.splice(index, 1);
  },
  setMenuMiniMode(state, payload) {
    state.menuMiniMode = payload
    localStorage.setItem("mesMenuMiniMode", payload.toString());
  }
}