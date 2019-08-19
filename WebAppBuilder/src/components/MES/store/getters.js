export default {
  linearLoader(state) {
    return state.linearLoader;
  },
  snackbar(state) {
    return state.snackbar;
  },
  properties(state) {
    return state.properties;
  },
  workCenter(state) {
    return state.workCenter;
  },
  dragResizeMode(state) {
    return state.tasksPageState.dragResizeMode;
  },
  tasks(state) {
    return state.tasks;
  },
  installations(state) {
    return state.installations;
  },
  productions(state) {
    return state.productions;
  },
  productionFormio(state) {
    return state.productionFormio;
  },
  menuMiniMode(state) {
    if (state.menuMiniMode === null) {
      state.menuMiniMode = localStorage.getItem("mesMenuMiniMode") === 'true';
    }
    return state.menuMiniMode;
  },
  tasksPageState(state) {
    return state.tasksPageState;
  },
  dialogLinearLoader(state) {
    return state.dialogLinearLoader;
  },
  obsoleteData(state) {
    return state.obsoleteData;
  },
  ticket(state) {
    return state.ticket;
  },
  selectedTask(state) {
    return state.tasksPageState.selectedTask;
  }
}