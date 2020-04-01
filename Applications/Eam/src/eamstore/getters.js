export default {
  loading(state) {
    return state.loading
  },
  error(state) {
    return state.error
  },
  menuMiniMode(state) {
    if (state.menuMiniMode === null) {
      state.menuMiniMode = localStorage.getItem('eamMenuMiniMode') === 'true'
    }
    return state.menuMiniMode
  },
  notifications(state) {
    if (state.notifications === null) {
      state.notifications = localStorage.getItem('eamNotifications') === 'true'
    }
    return state.notifications
  },
  search(state) {
    return state.search
  },
}