const getters = ({
  getAppData(state) {
    return key => state.appData[key]
  },
  getCurrentUser(state) {
    return state.currentUser
  },
  getCurrentUserLoginData(state) {
    return state.currentUser
          ? state.currentUser.CurrentUserData
          : {}
  },
  getCurrentUserRights(state) {
    return state.currentUser
          ? state.currentUser.DelegatedRights
          : {}
  },
  getCurrentUserPhoto(state) {
    return state.currentUser
      ? state.currentUser.CurrentUserData.UserPhoto
      : ""
  },
  getExistedIcons(state) {
    return state.existedIcons;
  }
})

export default getters
