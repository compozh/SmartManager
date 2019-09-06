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
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
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
  setProductions(state, productions) {
    state.productions = productions
  },
  setProductionFormio(state, formio) {
    state.productionFormio = formio
  },
  setDowntimeTypes(state, downtimeTypes) {
    state.downtimeTypes = downtimeTypes
  },
  resetProductionFormio(state) {
    state.productionFormio = {}
  },
  setDowntimeFormio(state, formio) {
    state.downtimeFormio = formio
  },
  resetDowntimeFormio(state) {
    state.downtimeFormio = {}
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
  setSelectedDowntime(state, selectedDowntime) {
    state.tasksPageState.selectedDowntime = selectedDowntime
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
  setWorkCentersForWorker(state, data) {
    state.workCentersForWorker = data.workCenters
    if (!state.workCenter) {
      var firstWorkCenterCodeByFixation = data.firstWorkCenter.code
      if (!data.workCenters) {
        return
      }
      data.workCenters.forEach(workCenter => {
        if (workCenter.code == firstWorkCenterCodeByFixation) {
          return state.workCenter = workCenter
        }
      })
    }
  },
  resetState(state) {
    state.tasks = []
    state.downtimes = []
    state.installations = []
    state.tasksPageState.selectedTask = null
    state.tasksPageState.selectedDowntime = null
  }
}
