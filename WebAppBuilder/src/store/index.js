import Vue from 'vue'
import Vuex from 'vuex'

// Store functionality
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import state from './state'

// Modules
import smartManagerStore from '../components/SmartManager/store/store'
import minfinStore from '../components/Minfin/store/index'
import eamStore from '../components/Eam/store/store'

Vue.use(Vuex)

// Create a new store
const store = new Vuex.Store({
  actions,
  getters,
  mutations,
  state,
  modules: {
    [minfinStore.namespace]:minfinStore,
    [smartManagerStore.namespace]:smartManagerStore,
    [eamStore.namespace]:eamStore,
  }
})

export default store