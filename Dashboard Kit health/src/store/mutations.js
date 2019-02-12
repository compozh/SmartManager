// https://vuex.vuejs.org/en/mutations.html
//мутация
const mutations = {
  setInformationFromServer(state,payload){
    state.information_from_server_list=payload;
  },
  setLoginStatus(state,payload){
    state.loginStatus=payload;
  },
  setTicket(state, payload){
    state.ticket=payload;
  },
  setErrorToday(state, payload){
    state.errorToday=payload
  }
}
export default mutations
