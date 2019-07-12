function _returnIndexByResourceId(cartitems,resourceId){
  let result = {
    success: false,
    returned: Number
  };

  for(var i=0;i<cartitems.length;i++){
    if(cartitems[i].resourceId === resourceId){
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
    let result = _returnIndexByResourceId(state.cartitems, payload.resourceId);
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
    let result = _returnIndexByResourceId(state.cartitems, payload.resourceId);
    state.cartitems[result.returned]  = payload;
  }
}