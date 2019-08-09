
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
  setTasksByWorkCentrer(state, {workCenterCode, tasks }) {
    let tasksByWorkCenter = {[workCenterCode]: tasks};
    let tempTasks = Object.assign({}, state.tasks);
    state.tasks = Object.assign(tempTasks, tasksByWorkCenter);
  },
  setInstallations(state, installations) {
    state.installations = installations;
  },
  setInstallationsByWorkCenter(state, { installations, workCenterCode}) {
    let installationsByWorkCenter = {[workCenterCode]: installations};
    let tempinstallations = Object.assign({}, state.installations);
    state.installations = Object.assign(tempinstallations, installationsByWorkCenter);
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
  setProductionFormio(state, { formio, formCode }) {
    let productionFormio = {[formCode]: formio};
    let tempProductionFormio = Object.assign({}, state.productionFormio);
    state.productionFormio = Object.assign(tempProductionFormio, productionFormio);
  },
  removeProduction(state, production) {
      let index = state.productions.indexOf(production);
      state.productions.splice(index, 1);
  },
  setMenuMiniMode(state, payload) {
    state.menuMiniMode = payload
    localStorage.setItem("mesMenuMiniMode", payload.toString());
  },
  setSelectedTasksTab(state, tabId) {
    state.tasksPageState.selectedTasksTab = tabId;
  },
  setCurrentLayout(state, currentLayout) {
    state.tasksPageState.currentLayout = currentLayout;
  },
  setSelectedTask(state, selectedTask) {
    state.tasksPageState.selectedTask = selectedTask;
  },
  changeDragResizeMode(state) {
    state.dragResizeMode = !state.dragResizeMode;
  }
}