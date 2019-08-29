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
import moduleTodo from './todo/moduleTodo.js'
import moduleCalendar from './calendar/moduleCalendar.js'
import moduleChat from './chat/moduleChat.js'
import moduleEmail from './email/moduleEmail.js'
import moduleECommerce from './eCommerce/moduleECommerce.js'

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
    todo: moduleTodo,
    calendar: moduleCalendar,
    chat: moduleChat,
    email: moduleEmail,
    eCommerce: moduleECommerce,
  },
  strict: process.env.NODE_ENV !== 'production'
})

export default store
