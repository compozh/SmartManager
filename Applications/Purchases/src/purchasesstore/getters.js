export default {
  getCartItems(state) {
    return state.cartitems
  },
  getCartItemsLength(state) {
    return state.cartitems.length > 0 ? state.cartitems.length.toString() : null
  },
  getResourceGroups(state) {
    return state.resourceGroups
  },
  getResources(state) {
    return state.resources
  },
  getTestItems(state) {
    return state.testItems
  },
  getMessage(state) {
    return state.snackbarMessage
  },
  getFavLists(state) {
    return state.favlists
  },
  getApplications(state) {
    return state.applications
  },
  showTitle(state) {
    return state.showTitle
  },
  getDocStatus(state) {
    return state.docStatus
  },
  getBreadCrumbs(state) {
    return state.breadcrumbs
  },
}