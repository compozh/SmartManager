export default {
  loading(state) {
    return state.loading
  },
  linear(state) {
    return state.linear
  },
  error(state) {
    return state.error
  },
  folders(state) {
    return state.folders
  },
  tasks(state) {
    const folderId = state.currentFolder
    return state.tasks[folderId]
  },
  taskInfo(state) {
    return state.taskInfo
  }
}