const getters = ({
  getAppData(state) {
    return key => state.appData[key]
  },
  getCurrentUser(state) {
    return state.currentUser
  },
  getCurrentUserLoginData(state) {
    return state.currentUser
          ? state.currentUser.LoginData
          : {}
  },
  getCurrentUserRights(state) {
    return state.currentUser
          ? state.currentUser.DelegatedRights
          : {}
  },
  getCurrentUserPhoto(state) {
    return state.currentUser
      ? state.currentUser.UserPhoto
      : ""
  },
  getExistedIcons(state) {
    return state.existedIcons;
  }
})

export default getters
