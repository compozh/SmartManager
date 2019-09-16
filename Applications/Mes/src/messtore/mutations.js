export default {
  setLinearLoader(state, linearLoader) {
    state.linearLoader = linearLoader
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
  setUserName(state, userName) {
    state.userName = userName
  },
  setWorkCenter(state, workCenter) {
    state.workCenter = workCenter
  },
  setTasks(state, tasks) {
    state.tasks = tasks
  },
  setDowntimes(state, downtimes) {
    state.downtimes = downtimes
  },
  setInstallations(state, installations) {
    state.installations = installations
  },
  removeInstallation(state, installation) {
    var index = state.installations.indexOf(installation)
    state.installations.splice(index, 1)
  },
  setUsersProductionEvents(state, usersProductionEvents) {
    state.usersProductionEvents = usersProductionEvents
  },
  setWorkCenterProductionEvents(state, workCenterProductionEvents) {
    state.workCenterProductionEvents = workCenterProductionEvents
  },
  setProductionFormio(state, formio) {
    state.productionFormio = formio
  },
  resetProductionFormio(state) {
    state.productionFormio = {}
  },
  setDowntimeFormio(state, formio) {
    state.downtimeFormio = formio
  },
  setCreateDowntimeFormio(state, formio) {
    state.createDowntimeFormio = formio
  },
  resetDowntimeFormio(state) {
    state.downtimeFormio = {}
  },
  removeProduction(state, production) {
    let index = state.usersProductionEvents.indexOf(production)
    state.usersProductionEvents.splice(index, 1)
    let indexWorkCenterProductionEvents = state.workCenterProductionEvents.indexOf(production)
    if (indexWorkCenterProductionEvents !== -1) {
      state.workCenterProductionEvents.splice(indexWorkCenterProductionEvents, 1)
    }
  },
  printProduction(state, production) {
    state.printProduction = production
  },
  changeMainContainerKey(state) {
    state.mainContainerKey += 1
  },
  setMaterialProduction(state, production) {
    state.setMaterialProduction = production
  },
  setMenuMiniMode(state, menuMiniMode) {
    state.menuMiniMode = menuMiniMode
    localStorage.setItem('mesMenuMiniMode', menuMiniMode.toString())
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
  setSelectedDowntime(state, selectedDowntime) {
    state.selectedDowntime = selectedDowntime
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
  setSelectedProductionTab(state, selectedProductionTab) {
    state.productionPageState.selectedProductionTab = selectedProductionTab
  },
  setWorkCentersForWorker(state, workCenters) {
    state.workCentersForWorker = workCenters
  },
  addActionAfterInitializeProperties(state, newAction) {
    state.actionsAfterInitializeProperties.push(newAction)
  },
  setActionsAfterInitializeProperties(state, actionsAfterInitializeProperties) {
    state.actionsAfterInitializeProperties = actionsAfterInitializeProperties
  },
  resetState(state) {
    state.tasks = []
    state.downtimes = []
    state.createDowntimeFormio = {}
    state.installations = []
    state.tasksPageState.selectedTask = null
    state.selectedDowntime = null
    state.workCenterProductionEvents = []
  }
}
