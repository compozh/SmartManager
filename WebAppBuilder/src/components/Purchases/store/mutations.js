export default {
  setCartItems(state, payload){
    state.cartitems = payload;
  },

  addCartItem(state, payload){
    state.cartitems.push(payload);
  }
}