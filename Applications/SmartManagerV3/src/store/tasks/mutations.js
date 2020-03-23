export default {
  SET_TASKS (state, tasks) {
    state.tasks = Object.assign({}, state.tasks, tasks)
  }
}
