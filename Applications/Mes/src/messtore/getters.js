export default {
  linearLoader(state) {
    return state.linearLoader
  },
  snackbar(state) {
    return state.snackbar
  },
  properties(state) {
    return state.properties
  },
  mobilityProperties(state) {
    return state.mobilityProperties
  },
  userName(state) {
    return state.userName
  },
  workCenter(state) {
    return state.workCenter
  },
  workCenterFixationData(state) {
    return state.workCenterFixationData
  },
  dragResizeMode(state) {
    return state.tasksPageState.dragResizeMode
  },
  tasks(state) {
    return state.tasks
  },
  filterValue(state) {
    return state.tasksPageState.filterValue
  },
  documentSearchValue(state) {
    return state.documentSearchValue
  },
  downtimes(state) {
    return state.downtimes
  },
  qualities(state) {
    return state.qualities
  },
  documents(state) {
    return state.documents
  },
  initializeQualities(state) {
    return state.initializeQualities
  },
  initializeDocuments(state) {
    return state.initializeDocuments
  },
  installations(state) {
    return state.installations
  },
  usersProductionEvents(state) {
    return state.usersProductionEvents
  },
  workCenterProductionEvents(state) {
    return state.workCenterProductionEvents
  },
  productionFormio(state) {
    return state.productionFormio
  },
  downtimeFormio(state) {
    return state.downtimeFormio
  },
  qualityFormio(state) {
    return state.qualityFormio
  },
  documentFormio(state) {
    return state.documentFormio
  },
  createDowntimeFormio(state) {
    return state.createDowntimeFormio
  },
  menuMiniMode(state) {
    if (state.menuMiniMode === null) {
      state.menuMiniMode = localStorage.getItem('mesMenuMiniMode') === 'true'
    }
    return state.menuMiniMode
  },
  menuDrawerMode(state) {
    if (state.menuDrawerMode === null) {
      state.menuDrawerMode = localStorage.getItem('mesMenuDrawerMode') === 'false'
    }
    return state.menuDrawerMode
  },
  tasksPageState(state) {
    return state.tasksPageState
  },
  dialogLinearLoader(state) {
    return state.dialogLinearLoader
  },
  obsoleteData(state) {
    return state.obsoleteData
  },
  ticket(state) {
    return state.ticket
  },
  mainContainerKey(state) {
    return state.mainContainerKey
  },
  documentKey(state){
    return state.documentKey
  },
  selectedTask(state) {
    return state.tasksPageState.selectedTask
  },
  selectedDowntime(state) {
    return state.selectedDowntime
  },
  selectedQuality(state) {
    return state.selectedQuality
  },
  selectedDocument(state) {
    return state.selectedDocument
  },
  initialWorkCenter(state) {
    return state.initialWorkCenter
  },
  workCentersForWorker(state) {
    return state.workCentersForWorker
  },
  selectedProductionTab(state) {
    return state.productionPageState.selectedProductionTab
  },
  actionsAfterInitializeProperties(state) {
    return state.actionsAfterInitializeProperties
  },
  dynamicPagesCache(state) {
    return state.dynamicPagesCache
  },
  cameraAvailability(state){
    return state.cameraSettings.cameraAvailability
  },
  cameraSettings(state) {
    return state.cameraSettings
  },
  iotSettings(state) {
    return state.iotSettings
  }
}
