export default {
    setCartItems({commit}, payload) {
        commit('setCartItems', payload)
    },
    addCartItem({commit},payload){
        commit('addCartItem',payload)
    },
    setMessage({commit},payload){
        commit('setMessage',payload)
    }
}