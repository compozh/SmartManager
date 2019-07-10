export default {
    setCartItems({commit}, payload) {
        commit('setCartItems', payload)
    },
    addCartItem({commit},payload){
        commit('addCartItem',payload)
    },
    deleteCartItem({commit}, payload){
        commit('deleteCartItem', payload)
    },
    deleteAllCarts({commit}){
        commit('deleteAllCarts')
    },
    createCartItem({commit}, payload){
        commit('createCartItem', payload);
    }
}