export default {
  setForm (state, form) {
    state.form = form
  },
  closeSnackbar (state) {
    state.snackbar.visible = false
  },
  setSnackbarMessage (state, message, type) {
    state.snackbar.message = message
    state.snackbar.type = type
    state.snackbar.visible = true
  }
}
