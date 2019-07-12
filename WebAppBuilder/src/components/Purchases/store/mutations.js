function _returnIndexById(cartitems,id){
  let result = {
    success: false,
    returned: Number
  };

  for(var i=0;i<cartitems.length;i++){
    if(cartitems[i].id === id){
        result.success = true;
        result.returned = i;
        break;
    }
  }

  return result;
}

export default {
  setCartItems(state, payload){
    state.cartitems = payload;
  },
  
  addCartItem(state, payload){
    let result = _returnIndexById(state.cartitems, payload.id);
    if(result.success){
      state.cartitems[result.returned]  = payload;
    }
    else{
      state.cartitems.push(payload);
    }    
  },

  setMessage(state, payload){
    state.snackbarMessage = payload
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
  },

  updateCartItem(state, payload){
    debugger;
    let result = _returnIndexById(state.cartitems, payload.id);
    state.cartitems[result.returned]  = payload;
  }
}