export default {
  TOGGLE_SIDEBAR_OPEN (state) {
    state.sideBarOpen = !state.sideBarOpen
  },
  SET_SEARCH (state, search) {
    state.search = search
  }
}
