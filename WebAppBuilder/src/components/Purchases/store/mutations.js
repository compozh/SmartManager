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
      state.cartitems.splice(result.returned,1,payload);
    }
    else{
      state.cartitems.push(payload);
    }    
  },

  setMessage(state, payload){
    state.snackbarMessage = payload
  },
  setFavLists(state, payload){
    state.favlists = payload;
  },
  addToFavLists(state, payload){
    let favListItem = { 
      alias : payload.Alias,  
      listiD : payload.Id.toString(), 
      keyValues : payload.KeyValues, 
      caption : payload.Caption, 
      isDefaultList: payload.IsDefaultList
    };
    /*state.favlists = */state.favlists.push(favListItem);
  },
  setChose(state, payload){
    //state.chose.list = payload.list;
    //state.chose.method = payload.method;
    //state.chose.caption = payload.caption;
    state.chose = payload;
  },
  setApplications(state, payload){
    state.applications = payload;
  },

  deleteCartItem(state, payload){
    state.cartitems = _.remove(state.cartitems, function(n){
      return n.id != payload;
    });
  },

  addToFavorites(state, payload){
    state.cartitems = _.remove(state.cartitems, function(n){
      return n.id != payload;
    });
  },
  addToFavoritesSecond(state, payload){
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
    let result = _returnIndexById(state.cartitems, payload.id);
    state.cartitems[result.returned]  = payload;
  },

  setResourceGroups(state, payload){
    state.resourceGroups = payload;
    state.resources = [];
    //TODO
    //state.testItems.children = payload;
    //state.testItems.resources = [];
    //debugger;
  },

  setResourceGroup(state, payload){
    state.resourceGroups = payload.children;
    state.resources = payload.resources;

    //TODO
    //state.testItems.children = payload.children;
    //state.testItems.resources = payload.resources;
    //debugger;
  },

  clearResourceGroups(state){
    state.resourceGroups = [];
  },

  setTitleState(state, payload){
    state.showTitle = payload;
  }
}