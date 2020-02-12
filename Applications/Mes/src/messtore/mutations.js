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
  setMobilityProperties(state, mobilityProperties) {
    state.mobilityProperties = mobilityProperties
  },
  setUserName(state, userName) {
    state.userName = userName
  },
  setWorkCenter(state, workCenter) {
    state.workCenter = workCenter
  },
  setWorkCenterFixationData(state, workCenterFixationData) {
    state.workCenterFixationData = workCenterFixationData
  },
  setTasks(state, tasks) {
    state.tasks = tasks
  },
  setFilterValue(state, filterValue) {
    state.tasksPageState.filterValue = filterValue
  },
  setDocumentSearchValue(state, documentSearchValue) {
    state.documentSearchValue = documentSearchValue
  },
  setDowntimes(state, downtimes) {
    state.downtimes = downtimes
  },
  setQualities(state, qualities) {
    state.qualities = qualities
  },
  setDocuments(state, documents) {
    state.documents = documents
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
  setQualityFormio(state, formio) {
    state.qualityFormio = formio
  },
  setDocumentFormio(state, formio) {
    state.documentFormio = formio
  },
  setInitializeQualities(state, initializeQualities) {
    state.initializeQualities = initializeQualities
  },
  setInitializeDocuments(state, initializeDocuments) {
    state.initializeDocuments = initializeDocuments
  },
  setCreateDowntimeFormio(state, formio) {
    state.createDowntimeFormio = formio
  },
  resetDowntimeFormio(state) {
    state.downtimeFormio = {}
  },
  resetQualityFormio(state) {
    state.qualityFormio = {}
  },
  resetDocumentFormio(state) {
    state.documentFormio = {}
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
  updateDocument(state){
    state.documentKey += 1
  },
  setMaterialProduction(state, production) {
    state.setMaterialProduction = production
  },
  setMenuMiniMode(state, menuMiniMode) {
    state.menuMiniMode = menuMiniMode
    localStorage.setItem('mesMenuMiniMode', menuMiniMode.toString())
  },
  setMenuDrawerMode(state, menuDrawerMode) {
    state.menuDrawerMode = menuDrawerMode
    localStorage.setItem('mesMenuDrawerMode', menuDrawerMode.toString())
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
  setSelectedQuality(state, selectedQuality) {
    state.selectedQuality = selectedQuality
  },
  setSelectedDocument(state, selectedDocument) {
    state.selectedDocument = selectedDocument
  },
  setAspectRatioLayout(state, aspectRatioLayout) {
    state.tasksPageState.aspectRatioLayout = aspectRatioLayout
  },
  setDynamicPagesCache(state, dynamicPagesCache) {
    state.dynamicPagesCache = dynamicPagesCache
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
  setCameraAvailability(state, value) {
    state.cameraSettings.cameraAvailability = value
  },
  setCameraInitialized(state, value) {
    state.cameraSettings.initialized = value
  },
  resetState(state) {
    state.tasks = []
    state.downtimes = []
    state.qualities = []
    state.documents = []
    state.createDowntimeFormio = {}
    state.installations = []
    state.tasksPageState.selectedTask = null
    state.selectedDowntime = null
    state.selectedQuality = null
    state.selectedDocument = null
    state.workCenterProductionEvents = []
  }
}
