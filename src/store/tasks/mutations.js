export default {
  SET_TASKS (state, tasks) {
    state.tasks = Object.assign({}, state.tasks, tasks)
  },
  SET_TASK_DETAILS (state, task) {
    state.taskDetails = Object.assign({}, state.taskDetails, task)
  },
  SHOW_TASK_DIALOG (state, toShow) {
    state.taskDialog = toShow
  },
  SET_TASK_EDITABLE (state, isEditable) {
    state.taskEditable = isEditable
  },
  SET_TASK_CHANGED (state, isChanged) {
    state.taskChanged = isChanged
  },
  SET_TASK_IS_READ (state, { taskId, folderId }) {
    const tasks = state.tasks
    if (tasks && tasks[folderId]) {
      const task = tasks[folderId].find(task => task.id === taskId)
      if (task && !task.isRead) {
        task.isRead = 1
      }
    }
  },
  DROP_TASK_IN_FOLDER (state, { folderId, taskId }) {
    state.tasks[folderId] = state.tasks[folderId].filter(task => task.id !== taskId)
  }
}
