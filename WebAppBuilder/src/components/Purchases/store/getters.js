export default {
  loading(state) {
    return state.loading
  },
  error(state) {
    return state.error
  },
  menuMiniMode(state, commit) {
    if (state.menuMiniMode === null) {
      state.menuMiniMode = localStorage.getItem("purchasesMenuMiniMode") === 'true';
    }
    return state.menuMiniMode;
  },
  search(state) {
    return state.search
  },
}