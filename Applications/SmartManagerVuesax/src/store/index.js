import Vue from 'vue'
import Vuex from 'vuex'

// Store functionality
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import state from './state'

// Modules
import appModule from './app/smStore'
import authModule from './auth/moduleAuth'
import notificationsModule from './notifications/moduleNotifications'

Vue.use(Vuex)

// Create a new store
const store = new Vuex.Store({
  actions,
  getters,
  mutations,
  state,
  modules: {
    [appModule.namespace]: appModule,
    notifications: notificationsModule,
    auth: authModule,
  },
  strict: process.env.NODE_ENV !== 'production'
})

export default store
