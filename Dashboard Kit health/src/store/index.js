/**
 * Vuex
 *
 * @library
 *
 * https://vuex.vuejs.org/en/
 */

// Lib imports
import Vue from 'vue'
import Vuex from 'vuex'

// Store functionality
import actions from './actions'
import getters from './getters'
import modules from './modules'
import mutations from './mutations'
import state from './state'
import VueApexCharts from 'vue-apexcharts'
import Spinner from 'vue-spinkit'
import moment from 'moment'
Vue.use(VueApexCharts)
Vue.component('Spinner', Spinner)
Vue.component('apexchart', VueApexCharts)
Vue.component('apexchart', VueApexCharts)
Vue.use(Vuex)

// Create a new store
const store = new Vuex.Store({
  actions,
  getters,
  modules,
  mutations,
  state,
})

export default store
