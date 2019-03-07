import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    appData:undefined
  },
  mutations: {
    setAppData(state, data){
      state.appData = data
    },
    updateData(state, data){
      var stack = data.path.split('.');
      var object = state.appData
      while(stack.length>1){
        object = object[stack.shift()];
      }    
      object[stack.shift()] = data.value;
    },
  },
  actions: {
    callAction(context, data){
      setTimeout(() => {
        alert
      }, 3000);
    }
  },
});
