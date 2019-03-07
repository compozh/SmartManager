const mutations = {
    setButton(state,payload){
        state.button=payload;
    },
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
      }
};
export default mutations
