const mutations = {
    setToolbar(state,payload){
        state.toolbar=payload;
    },
    setLoginStatus(state,payload){
      state.loginStatus=payload;
    },
    setAppData(state, data){
        state.test = data
    },
      updateData(state, data){
        var stack = data.path.split('.');
        var object = state.toolbar
        while(stack.length>1){
          object = object[stack.shift()];
        }    
        object[stack.shift()] = data.value;
      }
};
export default mutations
