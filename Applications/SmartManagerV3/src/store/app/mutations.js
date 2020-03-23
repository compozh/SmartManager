export default {
  SET_APPLICATIONS_PARAMS (state, params) {
    state.applicationParams = JSON.parse(params)
  },
  SET_PRELOADER (state, preLoader) {
    state.preLoader = preLoader
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
    state.folders = folders.sort(i => i.code === 'active' ? -1 : 0)
  },
  SET_CURRENT_FOLDER (state, folder) {
    state.currentFolder = folder
  }
}
