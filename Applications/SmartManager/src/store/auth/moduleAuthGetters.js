export default {
  // All user data
  userAllInfo: state => state.currentUser || {},
  userData: (state, getters) => getters.userAllInfo.UserData || {},

  // Logged user data
  delegatedRights: (state, getters) => getters.userData.DelegatedRights || [],
  loginData: (state, getters) => getters.userData.LoginData || {},
  loggedUserId: (state, getters) => getters.loginData.UserId || '',
  loggedUserLogin: (state, getters) => getters.loginData.UserLogin || '',
  loggedUserName: (state, getters) => getters.loginData.UserName || '',

  // Current user data
  currentUserData: (state, getters) => getters.userData.CurrentUserData || {},
  currentUserId: (state, getters) => getters.currentUserData.UserId || '',
  currentUserName: (state, getters) => getters.currentUserData.UserName || '',
  currentUserPhoto: (state, getters) => {
    let photoLink = getters.currentUserData.UserPhoto
    // Checking link valid
    return photoLink.includes('=&') ? '' : photoLink
  }
}
