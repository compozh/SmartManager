export default {
  SET_APPLICATIONS_PARAMS (state, params) {
    state.applicationParams = JSON.parse(params)
  },
  SET_PRELOADER (state, name) {
    const loaders = state.preLoaders
    if (loaders.includes(name)) {
      state.preLoaders = loaders.filter(i => i !== name)
    } else {
      state.preLoaders.push(name)
    }
  },
  TOGGLE_SIDEBAR_OPEN (state, value) {
    state.sideBarOpen = value
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
  }
}
