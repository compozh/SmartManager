export default {
  setLinearLoader(state, linearLoader) {
    state.linearLoader = linearLoader
  },
  closeSnackbar(state) {
    state.snackbar.visible = false
  },
  setSnackbarErrorMessage(state, message) {
    state.snackbar.message = message
    state.snackbar.type = 'error'
    state.snackbar.visible = true
  },
  setSnackbarSuccessMessage(state, message) {
    state.snackbar.message = message
    state.snackbar.type = 'success'
    state.snackbar.visible = true
  },
  setTicket(state, ticket) {
    state.ticket = ticket
  }
}
