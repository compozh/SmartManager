export default {
  setCurrentUser(state, currentUser) {
    state.currentUser = currentUser
  },
  setTempPassword(state, needEnterTempPassword) {
    state.needEnterTempPassword = needEnterTempPassword
  },
}