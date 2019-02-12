// https://vuex.vuejs.org/en/mutations.html
//мутация
const mutations = {
  setInformationFromServer(state,payload){
    state.information_from_server_list=payload;
  },
  setLoginStatus(state,payload){
    state.loginStatus=payload;
  },
  setErrorToday(state, payload){
    state.errorToday=payload
  }
}
export default mutations
