import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import smartManagerStore from '../smstore/store'

Vue.use(Vuex)

// Create a new store
const store = new Vuex.Store({
  state: {},
  modules: {
    [smartManagerStore.namespace]: smartManagerStore,
  }
})

export default store
