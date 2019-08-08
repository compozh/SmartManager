// import {SmartManagerApi} from '../api/smartManagerApi'

// const api = new SmartManagerApi()

export default {
  async setCartItems({commit}, payload) {
    commit('setCartItems', payload)
  },
  async addCartItem({commit},payload) {
    commit('addCartItem',payload)
  },
  async updateCartItem({commit},payload) {
    commit('updateCartItem',payload)
  },
  async setMessage({commit},payload) {
    commit('setMessage',payload)
  },
  asyncdeleteCartItem({commit}, payload) {
    commit('deleteCartItem', payload)
  },
  async deleteAllCarts({commit}) {
    commit('deleteAllCarts')
  },
  async createCartItem({commit}, payload) {
    commit('createCartItem', payload)
  },
  async setResourceGroups({commit}, payload) {
    commit('setResourceGroups', payload)
  },
  asyncsetChoseList({commit},payload) {
    commit('setChoseList',payload)
  },
  async addToFavorites({commit}, payload) {
    commit('addToFavorites', payload)
  },
  async addToFavoritesSecond({commit}, payload) {
    commit('addToFavoritesSecond', payload)
  },
  async clearResourceGroups({commit}) {
    commit('clearResourceGroups')
  },
  async setFavLists({commit}, payload) {
    commit('setFavLists', payload)
  },
  async setApplications({commit}, payload) {
    commit('setApplications', payload)
  },
  async setTitleState({commit}, payload) {
    commit('setTitleState', payload)
  },
}