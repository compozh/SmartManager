export default {
  getCartItems(state) {
    return state.cartitems;
  },
  getCartItemsLength(state) {
    return state.cartitems.length > 0 ? state.cartitems.length.toString() : null;
  },
  getResourceGroups(state) {
    return state.resourceGroups;
  },
  getMessage(state){
    return state.snackbarMessage;
  },
  getFavLists(state) {
    return state.favlists;
  },
  getApplications(state) {
    return state.applications;
  },
}