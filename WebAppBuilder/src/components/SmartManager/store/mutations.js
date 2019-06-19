export default {
  setLoading(state, payload) {
    state.loading = payload
  },
  setError(state, payload) {
    state.error = payload
  },
  clearError(state) {
    state.error = null
  },
  setFolders(state, payload) {
    state.folders = payload
  },
  setTasks(state, payload) {
    state.tasks = payload
  },
  setTaskInfo(state, payload) {
    state.taskInfo = payload
  }
}