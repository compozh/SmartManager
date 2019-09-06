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
  userName(state) {
    return state.userName
  },
  workCenter(state) {
    return state.workCenter
  },
  dragResizeMode(state) {
    return state.tasksPageState.dragResizeMode
  },
  tasks(state) {
    return state.tasks
  },
  downtimes(state) {
    return state.downtimes
  },
  installations(state) {
    return state.installations
  },
  productions(state) {
    return state.productions
  },
  productionFormio(state) {
    return state.productionFormio
  },
  downtimeTypes(state) {
    return state.downtimeTypes
  },
  downtimeFormio(state) {
    return state.downtimeFormio
  },
  menuMiniMode(state) {
    if (state.menuMiniMode === null) {
      state.menuMiniMode = localStorage.getItem('mesMenuMiniMode') === 'true'
    }
    return state.menuMiniMode
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
  selectedTask(state) {
    return state.tasksPageState.selectedTask
  },
  selectedDowntime(state) {
    return state.tasksPageState.selectedDowntime
  },
  initialWorkCenter(state) {
    return state.initialWorkCenter
  },
  workCentersForWorker(state) {
    return state.workCentersForWorker
  }
}
