export default {
  SET_APPLICATIONS_PARAMS (state, params) {
    state.applicationParams = JSON.parse(params)
  },
  SET_REFRESH_LOADER (state, refreshLoader) {
    state.refreshLoader = refreshLoader
  },
  START_PRELOADER (state, preLoader) {
    state.preLoaders.push(preLoader)
  },
  STOP_PRELOADER (state, preLoader) {
    state.preLoaders = state.preLoaders.filter(i => i !== preLoader)
  },
  START_LINEAR_PRELOADER (state, preLoader) {
    state.linearPreLoaders.push(preLoader)
  },
  STOP_LINEAR_PRELOADER (state, preLoader) {
    state.linearPreLoaders = state.linearPreLoaders.filter(i => i !== preLoader)
  },
  SIDE_BAR_LOCKED (state, value) {
    state.sideBarLocked = value
  },
  EXPAND_ON_HOVER (state, value) {
    state.expandOnHover = value
  },
  MINI_VARIANT (state, value) {
    state.miniVariant = value
  },
  SET_SEARCH (state, search) {
    state.search = search
  },
  SET_NOTIFY (state, notify) {
    state.notify = notify
  },
  SET_ACTIVE_ZONE (state, zone) {
    state.activeZone = zone
  },
  SET_USERS (state, users) {
    state.users = [...state.users, ...users]
  },
  ADD_USER (state, user) {
    state.users.push(user)
  },
  SET_PRIVATE_KEY (state, isSaved) {
    state.privateKeyIsSaved = isSaved
  }
}
