export default {
    setCartItems({commit}, payload) {
        commit('setCartItems', payload);
    },
    addCartItem({commit},payload){
        commit('addCartItem',payload);
    },
    updateCartItem({commit},payload){
        commit('updateCartItem',payload);
    },
    setMessage({commit},payload){
        commit('setMessage',payload);
    },
    deleteCartItem({commit}, payload){
        commit('deleteCartItem', payload);
    },
    deleteAllCarts({commit}){
        commit('deleteAllCarts');
    },
    createCartItem({commit}, payload){
        commit('createCartItem', payload);
    },
    setChoseList({commit},payload){
        commit('setChoseList',payload);
    },
    addToFavorites({commit}, payload){
        debugger;
        commit('addToFavorites', payload);
    },
    addToFavoritesSecond({commit}, payload){
        debugger;
        commit('addToFavoritesSecond', payload);
    }
}