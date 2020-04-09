import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import app from './app'
import auth from './auth'
import folders from './folders'
import tasks from './tasks'
import attachments from './attachments'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    app,
    auth,
    folders,
    tasks,
    attachments
  },
  strict: process.env.NODE_ENV !== 'production'
})
