export default {
  circularLoader(state) {
    return state.circularLoader
  },
  linearLoader(state) {
    return state.linearLoader
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