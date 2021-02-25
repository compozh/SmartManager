import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import app from './app'
import auth from './auth'
import folders from './folders'
import tasks from './tasks'
import cases from './cases'
import comments from './comments'
import attachments from './attachments'
import processes from './processes'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    auth,
    folders,
    tasks,
    cases,
    comments,
    attachments,
    processes
  },
  strict: process.env.NODE_ENV !== 'production'
})
