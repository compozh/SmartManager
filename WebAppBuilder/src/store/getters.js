const getters = ({
  getAppData(state) {
    return key => state.appData[key]
  },
  getCurrentUser(state) {
    return state.currentUser
  },
  getExistedIcons(state) {
    return state.existedIcons;
  }
})

export default getters
