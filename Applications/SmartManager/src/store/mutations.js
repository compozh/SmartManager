
const mutations = {
  // ////////////////////////////////////////////
  // SIDEBAR & UI UX
  // ////////////////////////////////////////////

  UPDATE_SIDEBAR_WIDTH(state, width) {
    state.sidebarWidth = width
  },
  UPDATE_SIDEBAR_ITEMS_MIN(state, val) {
    state.sidebarItemsMin = val
  },
  TOGGLE_REDUCE_BUTTON(state, val) {
    state.reduceButton = val
  },
  TOGGLE_CONTENT_OVERLAY(state, val) {
    state.bodyOverlay = val
  },
  TOGGLE_IS_SIDEBAR_ACTIVE(state, value) {
    state.isSidebarActive = value
  },
  UPDATE_THEME(state, val) {
    state.theme = val
  },
  UPDATE_WINDOW_BREAKPOINT(state, val) {
    state.breakpoint = val
  },
  UPDATE_PRIMARY_COLOR(state, val) {
    state.themePrimaryColor = val
  },
  UPDATE_USER_ROLE(state, val) {
    state.userRole = val
    localStorage.setItem('userRole', val)
  },
  UPDATE_WINDOW_WIDTH(state, width) {
    state.windowWidth = width
  },

  // The Navbar
  ARRANGE_STARRED_PAGES_LIMITED(state, list) {
    const starredPagesMore = state.starredPages.slice(10)
    state.starredPages = list.concat(starredPagesMore)
  },
  ARRANGE_STARRED_PAGES_MORE(state, list) {
    let downToUp = false
    let lastItemInStarredLimited = state.starredPages[10]
    const starredPagesLimited = state.starredPages.slice(0, 10)
    state.starredPages = starredPagesLimited.concat(list)

    state.starredPages.slice(0,10).map((i) => {
      if (list.indexOf(i) > -1) { downToUp = true }
    })
    if (!downToUp) {
      state.starredPages.splice(10, 0, lastItemInStarredLimited)
    }
  },
}

export default mutations
