const actions = ({
  updateSidebarWidth({ commit }, width) {
    commit('UPDATE_SIDEBAR_WIDTH', width)
  },
  toggleContentOverlay({ commit }) {
    commit('TOGGLE_CONTENT_OVERLAY')
  },
  updateTheme({ commit }, val) {
    commit('UPDATE_THEME', val)
  },
  updateWindowWidth({ commit }, width) {
    commit('UPDATE_WINDOW_WIDTH', width)
  }
})

export default actions
