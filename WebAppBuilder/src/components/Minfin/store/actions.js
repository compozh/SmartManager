export default {
  setUserData({commit}, payload) {
    commit("setUserData", payload)
  },
  resetUserData({commit}) {
    commit("resetUserData")
  }

}