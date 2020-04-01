export default {
  SET_TASKS (state, tasks) {
    state.tasks = Object.assign({}, state.tasks, tasks)
  },
  SET_TASK_DETAILS (state, task) {
    state.taskDetails = Object.assign({}, state.taskDetails, task)
  }
}
