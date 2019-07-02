export default {
  setCircularLoader(state, payload) {
    state.circularLoader = payload
  },
  setLinearLoader(state, payload) {
    state.linearLoader = payload
  },
  setError(state, payload) {
    state.error = payload
  },
  setMenuMode(state, payload) {
    state.menuMode = payload
  },
  setFolders(state, payload) {
    state.folders = payload
  },
  setCurrentFolder(state, payload) {
    state.currentFolder = payload
  },
  setTasks(state, payload) {
    state.tasks = Object.assign({}, state.tasks, payload)
  },
  setTaskInfo(state, payload) {
    state.taskInfo = payload
  }
}