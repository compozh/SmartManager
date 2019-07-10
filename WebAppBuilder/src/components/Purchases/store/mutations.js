export default {
  setCartItems(state, payload){
    state.cartitems = payload;
  },

  addCartItem(state, payload){
    state.cartitems.push(payload);
  },

  deleteCartItem(state, payload){
    state.cartitems = _.remove(state.cartitems, function(n){
      return n.id != payload;
    });
  },

  deleteAllCarts(state){
    state.cartitems = [];
  },

  createCartItem(state, payload){
    state.cartitems.push(payload);
  }
}