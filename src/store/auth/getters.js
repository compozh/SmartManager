export default {
  // All user data
  user: state => state.user || {},

  // Delegations
  delegatedUsers: (state, getters) => getters.user.delegatedUsers || [],
  delegatedRights: (state, getters) => getters.user.delegatedRights || [],

  // User data
  userId: (state, getters) => getters.user.id || '',
  userLogin: (state, getters) => getters.user.login || '',
  userName: (state, getters) => getters.user.userName || '',
  userPhoto: (state, getters) => {
    const photoLink = getters.user.userPhoto
    // Checking link is valid
    return photoLink && photoLink.includes('=&') ? '' : photoLink
  }
}
