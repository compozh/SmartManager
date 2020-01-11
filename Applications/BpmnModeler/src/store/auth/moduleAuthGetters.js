export default {
  // All user data
  user: state => state.user || {},

  // Delegated rights
  delegatedRights: (state, getters) => getters.user.delegatedRights || [],

  // User data
  userId: (state, getters) => getters.user.id || '',
  userLogin: (state, getters) => getters.user.login || '',
  userName: (state, getters) => getters.user.userName || '',
  userPhoto: (state, getters) => {
    let photoLink = getters.user.userPhoto
    // Checking link is valid
    return photoLink && photoLink.includes('=&') ? '' : photoLink
  }
};
