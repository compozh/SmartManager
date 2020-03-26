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
  TOGGLE_SIDEBAR_OPEN (state) {
    state.sideBarOpen = !state.sideBarOpen
  },
  SET_SEARCH (state, search) {
    state.search = search
  },
  SET_NOTIFY (state, notify) {
    state.notify = notify
  },
  SET_FOLDERS (state, folders) {
    state.folders = folders
  },
  SET_ACTIVE_FOLDER (state, folderId) {
    state.activeFolderId = folderId
  },
  SET_ACTIVE_ZONE (state, zone) {
    state.activeZone = zone
  }
}
