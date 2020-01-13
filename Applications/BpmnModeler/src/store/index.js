import Vue from 'vue';
import Vuex from 'vuex';

// Modules
import bpmnStore from '../bpmnstore/store';
import authModule from './auth/moduleAuth';

Vue.use(Vuex);

// Create a new store
const store = new Vuex.Store({
  state: {},
  modules: {
    [bpmnStore.namespace]: bpmnStore,
    auth: authModule
  }
});

export default store;
