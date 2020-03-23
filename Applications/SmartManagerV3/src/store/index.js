import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import app from './app'
import auth from './auth'
import tasks from './tasks'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    app,
    auth,
    tasks
  },
  strict: process.env.NODE_ENV !== 'production'
})
