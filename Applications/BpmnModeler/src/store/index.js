import Vue from 'vue';
import Vuex from 'vuex';

// Modules
import bpmnStore from '../bpmnstore/store';
import formiostore from '../formio/formiostore/store'

Vue.use(Vuex);

// Create a new store
const store = new Vuex.Store({
  state: {},
  modules: {
    [bpmnStore.namespace]: bpmnStore,
    [formiostore.namespace]: formiostore
  }
});

export default store;
