export default {
  setCurrentUser(context, payload) {
    context.commit('setCurrentUser',payload)
  },
  setTempPassword(context, payload) {
    context.commit('setTempPassword',payload)
  }
}