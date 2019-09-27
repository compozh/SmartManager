import Vue from 'vue'
import Vuex from 'vuex'

// Store functionality
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import state from './state'

// Modules
import appModule from './app/index'
import authModule from './auth/moduleAuth'
import personalInfoModule from './personalInfo/personalInfo'
import notificationsModule from './notifications/moduleNotifications'
import moduleECommerce from './eCommerce/moduleECommerce.js'
import moduleEducation from './education/education'

Vue.use(Vuex)

// Create a new store
const store = new Vuex.Store({
  actions,
  getters,
  mutations,
  state,
  modules: {
    [appModule.namespace]: appModule,
    [personalInfoModule.namespace]: personalInfoModule,
    notifications: notificationsModule,
    auth: authModule,
    eCommerce: moduleECommerce,
    education: moduleEducation

  },
  strict: process.env.NODE_ENV !== 'production'

})

export default store
