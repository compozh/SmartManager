export default {
  setLoading(state, payload) {
    state.loading = payload
  },
  setLinear(state, payload) {
    state.linear = payload
  },
  setError(state, payload) {
    state.error = payload
  },
  clearError(state) {
    state.error = null
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