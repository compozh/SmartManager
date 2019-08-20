import Vue from 'vue'
import Vuex from 'vuex'

// Store functionality
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import state from './state'

// Modules
import appModule from './app/index'
import authModeule from './auth/moduleAuth'

Vue.use(Vuex)

// Create a new store
const store = new Vuex.Store({
  actions,
  getters,
  mutations,
  state,
  modules: {
    [appModule.namespace]: appModule,
    ['auth']: authModeule,
  },
  strict: process.env.NODE_ENV !== 'production'

})

export default store
