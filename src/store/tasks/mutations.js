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
  }
}
