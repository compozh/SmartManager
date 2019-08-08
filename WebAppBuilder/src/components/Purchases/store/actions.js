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
    setResourceGroups({commit}, payload){
        commit('setResourceGroups', payload);
    },
    setChoseList({commit},payload){
        commit('setChoseList',payload);
    },
    addToFavorites({commit}, payload){
        commit('addToFavorites', payload);
    },
    addToFavoritesSecond({commit}, payload){
        commit('addToFavoritesSecond', payload);
    },
    clearResourceGroups({commit}){
        commit('clearResourceGroups', payload);
    },
    setFavLists({commit}, payload){
        commit('setFavLists', payload);
    },
    setApplications({commit}, payload){
        commit('setApplications', payload);
    },
    setTitleState({commit}, payload){
        commit('setTitleState', payload);
    },
    setBreadCrumbs({commit}, payload){
        commit('setBreadCrumbs', payload);
    },
}