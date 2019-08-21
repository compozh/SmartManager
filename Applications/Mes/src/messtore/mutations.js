export default {
  setLinearLoader(state, payload) {
    state.linearLoader = payload
  },
  closeDialogLinearLoader(state) {
    state.dialogLinearLoader.visible = false
  },
  closeSnackbar(state) {
    state.snackbar.visible = false
  },
  setDialogLinearLoaderMessage(state, message) {
    state.dialogLinearLoader.message = message
    state.dialogLinearLoader.visible = true
  },
  setSnackbarErrorMessage(state, message) {
    state.snackbar.message = message
    state.snackbar.type = 'error'
    state.snackbar.visible = true
  },
  setSnackbarSuccessMessage(state, message) {
    state.snackbar.message = message
    state.snackbar.type = 'success'
    state.snackbar.visible = true
  },
  setProperties(state, properties) {
    state.properties = properties
  },
  setWorkCenter(state, workCenter) {
    state.workCenter = workCenter
  },
  setTasks(state, tasks) {
    state.tasks = tasks
  },
  setInstallations(state, installations) {
    state.installations = installations
  },
  removeInstallation(state, installation) {
    var index = state.installations.indexOf(installation)
    state.installations.splice(index, 1)
  },
  setProductions(state, productions) {
    state.productions = productions
  },
  setProductionFormio(state, formio) {
    state.productionFormio = formio
  },
  resetProductionFormio(state) {
    state.productionFormio = null
  },
  removeProduction(state, production) {
    let index = state.productions.indexOf(production)
    state.productions.splice(index, 1)
  },
  setMenuMiniMode(state, payload) {
    state.menuMiniMode = payload
    localStorage.setItem('mesMenuMiniMode', payload.toString())
  },
  setSelectedTasksTab(state, tabId) {
    state.tasksPageState.selectedTasksTab = tabId
  },
  setCurrentLayout(state, currentLayout) {
    state.tasksPageState.currentLayout = currentLayout
  },
  setSelectedTask(state, selectedTask) {
    state.tasksPageState.selectedTask = selectedTask
  },
  setAspectRatioLayout(state, aspectRatioLayout) {
    state.tasksPageState.aspectRatioLayout = aspectRatioLayout
  },
  changeDragResizeMode(state) {
    state.tasksPageState.dragResizeMode = !state.tasksPageState.dragResizeMode
  },
  setObsoluteDataTask(state, obsoluteData) {
    state.obsoleteData.tasks = obsoluteData
  },
  setTicket(state, ticket) {
    state.ticket = ticket
  },
  setInitialWorkCenter(state, value) {
    state.initialWorkCenter = value
  },
  setWorkCentersForWorker(state, workCenters) {
    state.workCentersForWorker = workCenters
  }
}