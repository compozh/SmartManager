export default {
  setApplicationDescription(state, value) {
    state.applicationDescription = JSON.parse(value.data.webapps.application)
  }
}
