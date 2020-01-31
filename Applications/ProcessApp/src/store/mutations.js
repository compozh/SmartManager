export default {
  setForm (state, form) {
    state.form = form
  },
  closeSnackbar (state) {
    state.snackbar.visible = false
  },
  setSnackbarMessage (state, params) {
    state.snackbar.message = params.message
    state.snackbar.type = params.type
    state.snackbar.visible = true
  }
}
