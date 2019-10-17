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
  downtimes(state) {
    return state.downtimes
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
  createDowntimeFormio(state) {
    return state.createDowntimeFormio
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
  mainContainerKey(state) {
    return state.mainContainerKey
  },
  selectedTask(state) {
    return state.tasksPageState.selectedTask
  },
  selectedDowntime(state) {
    return state.selectedDowntime
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
  // afterInitializeWorkCenterEvents(state) {
  //   return state.events.afterInitializeWorkCenter
  // },
  // afterChangeTaskStateEvents(state) {
  //   return state.events.afterChangeTaskStateEvents
  // },
  // afterDowntimeRegistrationEvents(state) {
  //   return state.events.afterDowntimeRegistrationEvents
  // }
}
