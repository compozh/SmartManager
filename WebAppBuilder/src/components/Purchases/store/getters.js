export default {
  getCartItems(state) {
    return state.cartitems;
  },
  getCartItemsLength(state) {
    return state.cartitems.length > 0 ? state.cartitems.length.toString() : null;
  },

  getMessage(state){
    return state.snackbarMessage;
  }
}