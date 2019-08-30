export default {
  setCurrentUser(context, payload) {
    context.commit('setCurrentUser',payload)
  },
  setNeedEnterTempPassword(context, payload) {
    context.commit('setNeedEnterTempPassword',payload)
  }
}