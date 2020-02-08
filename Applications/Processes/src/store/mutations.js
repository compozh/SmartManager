export default {
  closeSnackbar (state) {
    state.snackbar.visible = false
  },
  setSnackbarMessage (state, params) {
    state.snackbar.message = params.message
    state.snackbar.type = params.type
    state.snackbar.visible = true
  },
  setProcesses (state, processes) {
    state.processes = processes
  },
  setSnackbarSuccessMessage (state, message) {
    state.snackbar.message = message
    state.snackbar.type = 'success'
    state.snackbar.visible = true
  }
}
