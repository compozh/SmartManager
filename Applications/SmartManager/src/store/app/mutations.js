export default {
  SET_APPLICATIONS_PARAMS (state, params) {
    state.applicationParams = JSON.parse(params)
  },
  START_PRELOADER (state, preLoader) {
    state.preLoaders.push(preLoader)
  },
  STOP_PRELOADER (state, preLoader) {
    state.preLoaders = state.preLoaders.filter(i => i !== preLoader)
  },
  SET_LINEAR_PRELOADER (state, value) {
    state.linearPreLoader = value
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
